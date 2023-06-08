import { UsePoolsParams } from '../types'
import { DataFetcher, LiquidityProviders, PoolCode } from '@sushiswap/router'
import { isRouteProcessor3ChainId } from '@sushiswap/route-processor'

export const getAllPoolsCodeMap = async ({ currencyA, currencyB, chainId }: Omit<UsePoolsParams, 'enabled'>) => {
  if (!currencyA || !currencyB || !chainId) {
    return new Map<string, PoolCode>()
  }
  const dataFetcher = DataFetcher.onChain(chainId)
  const liquidityProviders = [
    LiquidityProviders.SushiSwapV2,
    LiquidityProviders.Trident,
    LiquidityProviders.UniswapV2,
    LiquidityProviders.UniswapV3,
    LiquidityProviders.QuickSwap,
    LiquidityProviders.ApeSwap,
    LiquidityProviders.PancakeSwap,
    LiquidityProviders.TraderJoe,
    LiquidityProviders.Dfyn,
    LiquidityProviders.Elk,
    LiquidityProviders.JetSwap,
    LiquidityProviders.SpookySwap,
    LiquidityProviders.NetSwap,
    LiquidityProviders.HoneySwap,
    LiquidityProviders.UbeSwap,
    LiquidityProviders.Biswap,
    LiquidityProviders.DovishV3, // polygon zkevm
    LiquidityProviders.LaserSwap, // thundercore
  ]
  if (isRouteProcessor3ChainId(chainId)) {
    liquidityProviders.push(LiquidityProviders.SushiSwapV3)
  }
  dataFetcher.startDataFetching(liquidityProviders)
  await dataFetcher.fetchPoolsForToken(currencyA, currencyB)
  dataFetcher.stopDataFetching()
  return dataFetcher.getCurrentPoolCodeMap(currencyA, currencyB)
}
