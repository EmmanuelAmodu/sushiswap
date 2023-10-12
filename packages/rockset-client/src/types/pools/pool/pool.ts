import { z } from 'zod'
import { type BasePoolArgs, basePoolInputSchema } from '../base.js'

export const poolInputSchema = basePoolInputSchema

export type PoolArgs = BasePoolArgs

const poolOutputSchema = z.object({
  id: z.string(),
  chainId: z.number().int(),
  blockNumber: z.number().int(),
  _name: z.string(),
  address: z.string(),
  fee: z.number(),
  feeUsd: z.number(),
  isWhitelisted: z.boolean(),
  last1DFeeApr: z.number(),
  last1DFeeChangeUsd: z.number(),
  last1DFeeUsd: z.number(),
  last1DLiquidityUsd: z.number(),
  last1DLiquidityChangePercent: z.number(),
  last1DVolumeChangeUsd: z.number(),
  last1DVolumeChangePercent: z.number(),
  last1DTxCountChangePercent: z.number(),
  last1DTxCount: z.number(),
  last1DVolumeUsd: z.number(),
  last1HFeeApr: z.number(),
  last1HFeeChangeUsd: z.number(),
  last1HFeeUsd: z.number(),
  last1HLiquidityUsd: z.number(),
  last1HTxCount: z.number(),
  last1HVolumeUsd: z.number(),
  last30DFeeApr: z.number(),
  last30DFeeAprChange: z.number(),
  last30DFeeAprChangePercent: z.number(),
  last30DFeeChangePercent: z.number(),
  last30DFeeChangeUsd: z.number(),
  last30DFeeUsd: z.number(),
  last30DLiquidityChangePercent: z.number(),
  last30DLiquidityChangeUsd: z.number(),
  last30DLiquidityUsd: z.number(),
  last30DTxCount: z.number(),
  last30DTxCountChange: z.number(),
  last30DTxCountChangePercent: z.number(),
  last30DVolumeChangePercent: z.number(),
  last30DVolumeChangeUsd: z.number(),
  last30DVolumeUsd: z.number(),
  last7DFeeApr: z.number(),
  last7DFeeChangePercent: z.number(),
  last7DFeeChangeUsd: z.number(),
  last7DFeeUsd: z.number(),
  last7DLiquidityUsd: z.number(),
  last7DTxCount: z.number(),
  last7DTxCountChange: z.number(),
  last7DTxCountChangePercent: z.number(),
  last7DVolumeChangePercent: z.number(),
  last7DVolumeChangeUsd: z.number(),
  last7DVolumeUsd: z.number(),
  liquidity: z.string().nullable(),
  liquidityUsd: z.number(),
  protocol: z.string(),
  reserve0: z.number(),
  reserve0Usd: z.number(),
  reserve1: z.number(),
  reserve1Usd: z.number(),
  sqrtPriceX96: z.string().nullable(),
  tick: z.nullable(z.number()),
  feeGrowthGlobal0X128: z.string().nullable(),
  feeGrowthGlobal1X128: z.string().nullable(),
  txCount: z.number(),
  volumeToken0: z.string(),
  volumeToken0Usd: z.number(),
  volumeToken1: z.string(),
  volumeToken1Usd: z.number(),
  volumeUsd: z.number(),
  token0Id: z.string(),
  token0Name: z.string(),
  token0Address: z.string(),
  token0Decimals: z.number().int(),
  token0Symbol: z.string(),
  token1Id: z.string(),
  token1Name: z.string(),
  token1Address: z.string(),
  token1Decimals: z.number().int(),
  token1Symbol: z.string(),
  token0Price: z.number(),
  token1Price: z.number(),
})

export type Pool = z.infer<typeof poolOutputSchema>

export const transformPool = (input: Pool) => {
  return input
}

export const processPool = (input: unknown) => {
  const parsed = poolOutputSchema.safeParse(input)

  if (parsed.success === false) {
    return parsed
  }

  return { success: true as const, data: transformPool(parsed.data) }
}
