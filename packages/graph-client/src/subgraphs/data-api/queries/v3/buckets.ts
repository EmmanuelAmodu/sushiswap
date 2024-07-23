import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request'
import {
  ChainId
} from 'sushi'
import { isSushiSwapV3ChainId } from 'sushi/config'
import { graphql } from '../../graphql'
export const V3PoolBucketsQuery = graphql(
  `
query V3PoolBuckets($address: String!, $chainId: Int!) {
  v3PoolBuckets(address: $address, chainId: $chainId) {
    hourBuckets {
      id
      date
      volumeUSD
      liquidityUSD
      txCount
      feesUSD
    }
    dayBuckets {
      id
      date
      volumeUSD
      liquidityUSD
      txCount
      feesUSD
    }
  }
}
`,
)

export type GetV3PoolBuckets = VariablesOf<typeof V3PoolBucketsQuery>

export async function getV3PoolBuckets(
  variables: GetV3PoolBuckets,
  options?: RequestOptions,
) {
  const url = `https://data-api-production-acb1.up.railway.app/graphql/`
  const chainId = Number(variables.chainId) as ChainId

  if (!isSushiSwapV3ChainId(chainId)) {
    throw new Error('Invalid chainId')
  }

  const result = await request(
    { url, document: V3PoolBucketsQuery, variables },
    options,
  )
  if (result.v3PoolBuckets) {
    return {
      hourBuckets: result.v3PoolBuckets.hourBuckets.filter((b) => b !== null),
      dayBuckets: result.v3PoolBuckets.dayBuckets.filter((b) => b !== null),
    }
  }

  throw new Error('No buckets found')
}

export type V3PoolBuckets = Awaited<ReturnType<typeof getV3PoolBuckets>>
