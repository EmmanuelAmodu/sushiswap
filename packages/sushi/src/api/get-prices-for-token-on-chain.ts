import type { Address } from 'viem'
import type { ChainId } from '../chain/constants.js'

export function getPricesForTokenOnChain(chainId: ChainId, address: Address) {
  return fetch(`https://api.sushi.com/price/v1/${chainId}/${address}`)
}
