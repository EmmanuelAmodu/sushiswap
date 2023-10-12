import { processPoolBucket } from '@sushiswap/rockset-client'
import { createClient } from '@sushiswap/rockset-client/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export enum BucketGranularity {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

const schema = z.object({
  chainId: z.string(),
  address: z.string(),
  granularity: z.nativeEnum(BucketGranularity),
})

export async function GET(
  request: Request,
  params: {
    params: { chainId: string; address: string; granularity: BucketGranularity }
  },
) {
  const { searchParams } = new URL(request.url)
  const parsedParams = schema.safeParse({
    ...params.params,
    granularity: searchParams.get('granularity'),
  })
  if (!parsedParams.success) {
    return new Response(parsedParams.error.message, { status: 400 })
  }
  const id =
    `${parsedParams.data.chainId}:${parsedParams.data.address}`.toLowerCase()

  const client = await createClient()
  const result: unknown[] = await client.queries.query({
    sql: {
      query: `
      SELECT 
			entityId as id,
			timeBucket,
			timestamp,
			granularity,
			volumeUsd,
			liquidityUsd,
			feeUsd,
			feeApr
			FROM entities WHERE namespace = '${process.env.ROCKSET_ENV}'
			AND entityType = 'PoolStat'
			AND granularity = :granularity
			AND poolId = :id
			ORDER BY timestamp DESC
      LIMIT 100
      `,
      parameters: [
        {
          name: 'id',
          type: 'string',
          value: id,
        },
        {
          name: 'granularity',
          type: 'string',
          value: parsedParams.data.granularity,
        },
      ],
    },
  })

  if (!result.length) {
    return new Response(`no buckets found for pool ${id}`, { status: 404 })
  }

  const processedBuckets = result
    ? result.filter((b) => processPoolBucket(b).success)
    : []

  return NextResponse.json(processedBuckets)
}
