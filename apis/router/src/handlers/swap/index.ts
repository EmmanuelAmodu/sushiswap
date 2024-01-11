import {
  NativeWrapProvider,
  Router,
  RouterLiquiditySource,
  makeAPI02Object,
} from '@sushiswap/router'

import { Request, Response } from 'express'
import { ChainId } from 'sushi/chain'
import { ROUTE_PROCESSOR_3_2_ADDRESS } from 'sushi/config'
import { Type } from 'sushi/currency'
import { Address, PublicClient } from 'viem'
import { CHAIN_ID, POOL_FETCH_TIMEOUT } from '../../config'
import requestStatistics, {
  ResponseRejectReason,
} from '../../request-statistics'
import { ExtractorClient } from './ExtractorClient'
import { querySchema3, querySchema3_1, querySchema3_2 } from './schema'

const nativeProvider = new NativeWrapProvider(
  CHAIN_ID as ChainId,
  undefined as unknown as PublicClient, // actually it is not used
)

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

async function processUnknownToken(
  client: ExtractorClient,
  p: Promise<Type | undefined>,
) {
  const token = await p
  if (!token) return
  await Promise.any([client.fetchTokenPools(token), delay(POOL_FETCH_TIMEOUT)])
  return token
}

const clients: Map<ChainId, ExtractorClient> = new Map()

function handler(
  qSchema: typeof querySchema3 | typeof querySchema3_1 | typeof querySchema3_2,
  rpCode: typeof Router.routeProcessor3Params,
  rpAddress: Record<number, Address>,
) {
  return async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
    try {
      const statistics = requestStatistics.requestProcessingStart()

      const parsed = qSchema.safeParse(req.query)
      if (!parsed.success) {
        requestStatistics.requestRejected(
          ResponseRejectReason.WRONG_INPUT_PARAMS,
        )
        return res.status(422).send('Request parameters parsing error')
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

      const client = clients.get(chainId)
      if (client === undefined) {
        requestStatistics.requestRejected(
          ResponseRejectReason.UNSUPPORTED_NETWORK,
        )
        return res.status(422).send(`Network ${chainId} is not supported`)
      }

      type T = Type | undefined | Promise<Type | undefined>
      let tokenIn: T = client.getToken(_tokenIn)
      let tokenOut: T = client.getToken(_tokenOut)

      let tokensAreKnown = true
      if (tokenIn instanceof Promise) {
        tokensAreKnown = false
        tokenIn = await processUnknownToken(client, tokenIn)
      }
      if (tokenOut instanceof Promise) {
        tokensAreKnown = false
        tokenOut = await processUnknownToken(client, tokenOut)
      }

      if (!tokenIn || !tokenOut) {
        requestStatistics.requestRejected(
          ResponseRejectReason.UNSUPPORTED_TOKENS,
        )
        return res
          .status(422)
          .send(`Unknown token ${tokenIn === undefined ? _tokenIn : _tokenOut}`)
      }

      const poolCodesMap = client.getKnownPoolsForTokens(tokenIn, tokenOut)
      nativeProvider
        .getCurrentPoolList()
        .forEach((p) => poolCodesMap.set(p.pool.uniqueID(), p))

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

      const json = makeAPI02Object(
        bestRoute,
        to
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
        rpAddress[chainId] as Address,
      )

      requestStatistics.requestWasProcessed(statistics, tokensAreKnown)
      return res.json(json)
    } catch (e) {
      requestStatistics.requestRejected(ResponseRejectReason.UNKNOWN_EXCEPTION)
      throw e
    }
  }
}

export const swapV3_2 = handler(
  querySchema3_2,
  Router.routeProcessor3_2Params,
  ROUTE_PROCESSOR_3_2_ADDRESS,
)
