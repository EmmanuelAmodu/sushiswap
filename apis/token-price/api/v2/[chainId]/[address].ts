import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isExtractorSupportedChainId } from 'sushi/config'
import { isAddress } from 'viem'
import { z } from 'zod'
import { Currency, getPrice } from '../../../lib/api/v2.js'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  address: z.coerce.string().refine(isAddress, {
    message: 'Address is not checksummed.',
  }),
  currency: z.nativeEnum(Currency).default(Currency.USD),
})

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')

  const { chainId, currency, address } = schema.parse(request.query)

  if (!isExtractorSupportedChainId(chainId)) {
    const price = await fetch(
      `https://token-price.sushi.com/v1/${chainId}/${address}?currency=${currency}`,
    )
    const json = await price.json()
    return response.status(200).json(json)
  } else {
    const price = await getPrice(chainId, address, currency)
    console.log({ price })

    if (price === undefined) return response.status(404).send(0)

    return response.status(200).json(price)
  }
}

export default handler
