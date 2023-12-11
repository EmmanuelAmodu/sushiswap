import 'dotenv/config'

import * as Sentry from '@sentry/node'
import {
  PoolCode,
  Router,
  RouterLiquiditySource,
  getNativeWrapBridgePoolCode
} from '@sushiswap/router'
import {
  ADDITIONAL_BASES,
  BASES_TO_CHECK_TRADES_AGAINST,
} from '@sushiswap/router-config'
// import cors from 'cors'
import express, { type Express, type Request, type Response } from 'express'
import { ChainId } from 'sushi/chain'
import {
  // EXTRACTOR_SUPPORTED_CHAIN_IDS,
  type ExtractorSupportedChainId,
  ROUTE_PROCESSOR_3_1_ADDRESS,
  ROUTE_PROCESSOR_3_2_ADDRESS,
  ROUTE_PROCESSOR_3_ADDRESS,
  RouteProcessor3ChainId,
  type RouteProcessor3_1ChainId,
  type RouteProcessor3_2ChainId,
  isExtractorSupportedChainId,
  isRouteProcessor3ChainId,
  isRouteProcessor3_1ChainId,
  isRouteProcessor3_2ChainId,
} from 'sushi/config'
import { Native } from 'sushi/currency'
import { type Address, isAddress } from 'viem'
import z from 'zod'
import {
  findToken,
  getCurrentPoolCodes,
  getCurrentPoolCodesForTokens,
  getPoolCodesForTokensFull
} from './lib/api'
import { RequestStatistics, ResponseRejectReason } from './requestStatistics'
import { EnabledExtractorChainId, isEnabledExtractorChainId } from './config'

const querySchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ChainId.ETHEREUM)
    .refine(
      (chainId) =>
        isRouteProcessor3ChainId(chainId as RouteProcessor3ChainId) &&
        isExtractorSupportedChainId(chainId) && 
        isEnabledExtractorChainId(chainId),
      {
        message: 'ChainId not supported.',
      },
    )
    .transform((chainId) => chainId as EnabledExtractorChainId),
  tokenIn: z.string(),
  tokenOut: z.string(),
  amount: z.string().transform((amount) => BigInt(amount)),
  gasPrice: z.optional(z.coerce.number().int().gt(0)),
  source: z.optional(z.nativeEnum(RouterLiquiditySource)),
  to: z
    .optional(z.string())
    .transform((to) => (to ? (to as Address) : undefined)),
  preferSushi: z.optional(z.coerce.boolean()),
  maxPriceImpact: z.optional(z.coerce.number()),
})

const querySchema3_1 = querySchema.extend({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ChainId.ETHEREUM)
    .refine(
      (chainId) =>
        isRouteProcessor3_1ChainId(chainId as RouteProcessor3_1ChainId) &&
        isExtractorSupportedChainId(chainId) && 
        isEnabledExtractorChainId(chainId),
      {
        message: 'ChainId not supported.',
      },
    )
    .transform((chainId) => chainId as EnabledExtractorChainId),
})

const querySchema3_2 = querySchema.extend({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ChainId.ETHEREUM)
    .refine(
      (chainId) =>
        isRouteProcessor3_2ChainId(chainId as RouteProcessor3_2ChainId) &&
        isExtractorSupportedChainId(chainId) && 
        isEnabledExtractorChainId(chainId),
      {
        message: 'ChainId not supported.',
      },
    )
    .transform((chainId) => chainId as Exclude<RouteProcessor3_2ChainId, 314>),
})

const PORT = process.env['SWAP_API_PORT'] || 80

const SENTRY_DSN = process.env['SENTRY_DSN'] as string

const requestStatistics = new RequestStatistics(60_000, 3_600_000)

let wagmi: any
async function main() {
  const app: Express = express()

  wagmi = await import('wagmi')

  Sentry.init({
    enabled: false,
    dsn: SENTRY_DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({
        tracing: true,
      }),
      // enable Express.js middleware tracing
      new Sentry.Integrations.Express({
        app,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.1, // Capture 10% of the transactions, reduce in production!,
  })

  // app.use(
  //   cors({
  //     origin: /sushi\.com$/,
  //   }),
  // )

  // Trace incoming requests
  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())

  app.get(
    '/',
    processRequest(
      querySchema,
      Router.routeProcessor3Params,
      ROUTE_PROCESSOR_3_ADDRESS,
    ),
  )
  app.get(
    '/v3.1',
    processRequest(
      querySchema3_1,
      Router.routeProcessor3_1Params,
      ROUTE_PROCESSOR_3_1_ADDRESS,
    ),
  )
  app.get(
    '/v3.2',
    processRequest(
      querySchema3_2,
      Router.routeProcessor3_2Params,
      ROUTE_PROCESSOR_3_2_ADDRESS,
    ),
  )

  app.get('/health', (_, res: Response) => {
    return res.status(200).send()
  })

  app.get('/pool-codes-for-token', async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
    // console.log('HTTP: GET /get-pool-codes-for-tokens', JSON.stringify(req.query))
    const { chainId, address } = z
      .object({
        chainId: z.coerce
          .number()
          .int()
          .gte(0)
          .lte(2 ** 256)
          .default(ChainId.ETHEREUM)
          .refine((chainId) => isExtractorSupportedChainId(chainId), {
            message: 'ChainId not supported.',
          })
          .transform((chainId) => chainId as ExtractorSupportedChainId),
        address: z.coerce.string().refine(isAddress, {
          message: 'Address is not checksummed.',
        }),
      })
      .parse(req.query)
    // const extractor = extractors.get(chainId) as Extractor
    // const tokenManager = extractor.tokenManager
    const token = await findToken(address)
    if (!token) {
      return res.status(422).send(`Token ${address} is not supported`)
    }
    const poolCodesMap = new Map<string, PoolCode>()
    const common = BASES_TO_CHECK_TRADES_AGAINST?.[chainId] ?? []
    const additional = ADDITIONAL_BASES[chainId]?.[token.wrapped.address] ?? []
    const tokens = Array.from(
      new Set([token.wrapped, ...common, ...additional]),
    )
    const { prefetched: cachedPoolCodes } =
      // extractor.getPoolCodesForTokensFull(tokens)
      await getPoolCodesForTokensFull(tokens)

    cachedPoolCodes.forEach((p) => poolCodesMap.set(p.pool.address, p))
    // if (fetchingNumber > 0) {
    //   const poolCodes = await extractor.getPoolCodesForTokensAsync(
    //     tokens,
    //     2_000,
    //   )
    //   poolCodes.forEach((p) => poolCodesMap.set(p.pool.address, p))
    // }
    const { serialize } = await import('wagmi')
    return res.json(serialize(Array.from(poolCodesMap.values())))
  })

  app.get('/pool-codes', async (req: Request, res: Response) => {
    // console.log('HTTP: GET /pool-codes', JSON.stringify(req.query))
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
    const { chainId } = z
      .object({
        chainId: z.coerce
          .number()
          .int()
          .gte(0)
          .lte(2 ** 256)
          .default(ChainId.ETHEREUM)
          .refine((chainId) => isExtractorSupportedChainId(chainId), {
            message: 'ChainId not supported.',
          })
          .transform((chainId) => chainId as ExtractorSupportedChainId),
      })
      .parse(req.query)
    // const extractor = extractors.get(chainId) as Extractor
    // const poolCodes = extractor.getCurrentPoolCodes()
    const poolCodes = await getCurrentPoolCodes(chainId)
    const { serialize } = await import('wagmi')
    res.json(serialize(poolCodes))
  })

  // app.get('/debug-sentry', function mainHandler(req, res) {
  //   throw new Error('My first Sentry error!')
  // })

  // The error handler must be registered before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler())

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
    requestStatistics.start()
  })
}

function processRequest(
  qSchema: typeof querySchema | typeof querySchema3_2,
  rpCode: typeof Router.routeProcessor3Params,
  rpAddress: Record<number, Address>,
) {
  return async (req: Request, res: Response) => {
    // const statistics = requestStatistics.requestProcessingStart()
    const parsed = qSchema.safeParse(req.query)
    if (!parsed.success) {
      requestStatistics.requestRejected(ResponseRejectReason.WRONG_INPUT_PARAMS)
      return res.status(422).send()
    }
    const {
      chainId,
      tokenIn: _tokenIn,
      tokenOut: _tokenOut,
      amount,
      gasPrice,
      source,
      to,
      preferSushi,
      maxPriceImpact,
    } = parsed.data
    // const extractor = extractors.get(chainId) as Extractor
    // const tokenManager = extractor.tokenManager

    // Timing optimization: try to take tokens sync first - to avoid async call if tokens are known
    // let tokensAreKnown = true
    // let tokenIn =
    //   _tokenIn === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    //     ? Native.onChain(chainId) : findToken(_tokenIn as Address)
    // let tokenOut =
    //   _tokenOut === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    //     ? Native.onChain(chainId)
    //     : getKnownToken(_tokenOut as Address)

    const tokensFound = await Promise.all([
      findToken(_tokenIn as Address),
      findToken(_tokenOut as Address),
    ])
    const tokenIn = tokensFound[0]
    const tokenOut = tokensFound[1]
    // if (!tokenIn || !tokenOut) {
    //   // take unknown tokens async
    //   tokensAreKnown = false
    //   if (tokenIn === undefined && tokenOut !== undefined) {
    //     tokenIn = await getKnownToken(tokenIn)
    //   } else if (tokenIn !== undefined && tokenOut === undefined) {
    //     tokenOut =  await getKnownToken(tokenOut)
    //   } else {
    //     // both tokens are unknown
    //     const tokens = await Promise.all([
    //       findToken(_tokenIn as Address),
    //       findToken(_tokenOut as Address),
    //     ])
    //     tokenIn = tokens[0]
    //     tokenOut = tokens[1]
    //   }
    // }

    if (!tokenIn || !tokenOut) {
      requestStatistics.requestRejected(ResponseRejectReason.UNSUPPORTED_TOKENS)
      throw new Error('tokenIn or tokenOut is not supported')
    }

    const poolCodesMap = new Map<string, PoolCode>()
    const nativeWrapBridgePoolCode = getNativeWrapBridgePoolCode(chainId)
    poolCodesMap.set(
      nativeWrapBridgePoolCode.pool.uniqueID(),
      nativeWrapBridgePoolCode,
    )

    // const common = BASES_TO_CHECK_TRADES_AGAINST?.[chainId] ?? []
    // const additionalA = tokenIn
    //   ? ADDITIONAL_BASES[chainId]?.[tokenIn.wrapped.address] ?? []
    //   : []
    // const additionalB = tokenOut
    //   ? ADDITIONAL_BASES[chainId]?.[tokenOut.wrapped.address] ?? []
    //   : []

    // const tokens = [
    //   tokenIn.wrapped,
    //   tokenOut.wrapped,
    //   ...common,
    //   ...additionalA,
    //   ...additionalB,
    // ]

    // const poolCodes = 
    // tokensAreKnown
    //   ? extractor.getPoolCodesForTokens(tokens) // fast version
    //   : await extractor.getPoolCodesForTokensAsync(tokens, 2_000)
    
    const poolCodes = await getCurrentPoolCodesForTokens(chainId, tokenIn.address, tokenOut.address)
    poolCodes.forEach((p) => poolCodesMap.set(p.pool.uniqueID(), p))

    const bestRoute = preferSushi
      ? Router.findSpecialRoute(
          poolCodesMap,
          chainId,
          tokenIn,
          amount,
          tokenOut,
          gasPrice ?? 30e9,
        )
      : Router.findBestRoute(
          poolCodesMap,
          chainId,
          tokenIn,
          amount,
          tokenOut,
          gasPrice ?? 30e9,
        )

    const resp = res.json(
      wagmi.serialize({
        route: {
          status: bestRoute?.status,
          fromToken:
            bestRoute?.fromToken?.address === ''
              ? Native.onChain(chainId)
              : bestRoute?.fromToken,
          toToken:
            bestRoute?.toToken?.address === ''
              ? Native.onChain(chainId)
              : bestRoute?.toToken,
          primaryPrice: bestRoute?.primaryPrice,
          swapPrice: bestRoute?.swapPrice,
          amountIn: bestRoute?.amountIn,
          amountInBI: bestRoute?.amountInBI,
          amountOut: bestRoute?.amountOut,
          amountOutBI: bestRoute?.amountOutBI,
          priceImpact: bestRoute?.priceImpact,
          totalAmountOut: bestRoute?.totalAmountOut,
          totalAmountOutBI: bestRoute?.totalAmountOutBI,
          gasSpent: bestRoute?.gasSpent,
          legs: bestRoute?.legs,
        },
        args: to
          ? rpCode(
              poolCodesMap,
              bestRoute,
              tokenIn,
              tokenOut,
              to,
              rpAddress[chainId] as Address,
              [],
              maxPriceImpact,
              source ?? RouterLiquiditySource.Sender,
            )
          : undefined,
      }),
    )
    // requestStatistics.requestWasProcessed(statistics, tokensAreKnown)
    return resp
  }
}

main()
