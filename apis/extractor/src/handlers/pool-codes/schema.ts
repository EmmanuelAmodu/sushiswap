import { ChainId } from 'sushi/chain'
import {
  ExtractorSupportedChainId,
  isExtractorSupportedChainId,
} from 'sushi/config'
import z from 'zod'

const schema = z.object({
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

export default schema
