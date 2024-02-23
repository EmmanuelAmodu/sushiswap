'use client'

import { ChainId } from 'sushi/chain'
import { Native } from 'sushi/currency'
import { useAngleRewards } from '@sushiswap/react-query'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LinkInternal,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import { FC } from 'react'
import { getAddress } from 'viem'

import { isAngleEnabledChainId } from 'sushi/config'
import { DistributionDataTable } from './DistributionDataTable'
import { ExtendedPool } from 'src/lib/hooks/api/useFlairPoolGraphData'

interface PoolRewardDistributionsCardParams {
  pool: ExtendedPool
}

export const PoolRewardDistributionsCard: FC<
  PoolRewardDistributionsCardParams
> = ({ pool }) => {
  const { data: rewardsData, isLoading: rewardsLoading } = useAngleRewards({
    chainId: Number(pool.chainId) as ChainId,
  })

  if (!pool) return null
  if (!isAngleEnabledChainId(Number(pool.chainId))) return null

  const currentAngleRewardsPool = rewardsData?.pools[getAddress(pool.address)]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reward distributions</CardTitle>
        <CardDescription>
          Anyone can add distributions to this pool.{' '}
          {pool.token0 && pool.token1 ? (
            <LinkInternal
              href={`/pool/incentivize?chainId=${pool.chainId}&fromCurrency=${
                pool.token0.wrapped.address ===
                Native.onChain(Number(pool.chainId)).wrapped.address
                  ? 'NATIVE'
                  : pool.token0.wrapped.address
              }&toCurrency=${
                pool.token1.wrapped.address ===
                Native.onChain(Number(pool.chainId)).wrapped.address
                  ? 'NATIVE'
                  : pool.token1.wrapped.address
              }&feeAmount=${pool.swapFee * 10_000 * 100}`}
            >
              <Button asChild variant="link">
                Want to add one?
              </Button>
            </LinkInternal>
          ) : null}
        </CardDescription>
      </CardHeader>
      <Tabs className="w-full" defaultValue="active">
        <CardContent>
          <TabsList className="!flex">
            <TabsTrigger value="active" className="flex flex-1">
              Active
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex flex-1">
              Upcoming & Expired
            </TabsTrigger>
          </TabsList>
        </CardContent>
        <TabsContent value="active">
          <DistributionDataTable
            isLoading={rewardsLoading}
            data={currentAngleRewardsPool?.distributionData.filter(
              (el) => el.isLive,
            )}
          />
        </TabsContent>
        <TabsContent value="inactive">
          <DistributionDataTable
            isLoading={rewardsLoading}
            data={currentAngleRewardsPool?.distributionData.filter(
              (el) => !el.isLive,
            )}
          />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
