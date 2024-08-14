import type { ChainId } from '../chain/constants.js'

export function getPricesForChain(chainId: ChainId) {
  return fetch(`https://api.sushi.com/price/v1/${chainId}`)
}
