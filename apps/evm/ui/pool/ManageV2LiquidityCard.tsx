'use client'

import { Protocol } from '@sushiswap/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import { FC } from 'react'

import { Pool } from '@sushiswap/rockset-client'
import { AddSectionStake } from './AddSectionStake'
import { AddSectionTrident } from './AddSectionTrident'
import { AddSectionV2 } from './AddSectionV2'
import { PoolPositionProvider } from './PoolPositionProvider'
import { PoolPositionRewardsProvider } from './PoolPositionRewardsProvider'
import { PoolPositionStakedProvider } from './PoolPositionStakedProvider'
import { RemoveSectionTrident } from './RemoveSectionTrident'
import { RemoveSectionUnstake } from './RemoveSectionUnstake'
import { RemoveSectionV2 } from './RemoveSectionV2'

interface ManageV2LiquidityCardProps {
  pool: Pool
}

export const ManageV2LiquidityCard: FC<ManageV2LiquidityCardProps> = ({
  pool,
}) => {
  // const isFarm = pool.wasIncentivized || pool.isIncentivized
  const isFarm = false
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage</CardTitle>
        <CardDescription>Manage your position</CardDescription>
      </CardHeader>
      <Tabs className="w-full" defaultValue="add">
        <CardContent>
          <TabsList className="!flex">
            <TabsTrigger
              testdata-id="add-tab"
              value="add"
              className="flex flex-1"
            >
              Add
            </TabsTrigger>
            <TabsTrigger
              testdata-id="remove-tab"
              value="remove"
              className="flex flex-1"
            >
              Remove
            </TabsTrigger>
            <TabsTrigger
              testdata-id="stake-tab"
              disabled={!isFarm}
              value="stake"
              className="flex flex-1"
            >
              Stake
            </TabsTrigger>
            <TabsTrigger
              testdata-id="unstake-tab"
              disabled={!isFarm}
              value="unstake"
              className="flex flex-1"
            >
              Unstake
            </TabsTrigger>
          </TabsList>
        </CardContent>
        <div className="px-6 pb-4">
          <Separator />
        </div>
        <PoolPositionProvider pool={pool}>
          <PoolPositionStakedProvider pool={pool}>
            <PoolPositionRewardsProvider pool={pool}>
              <TabsContent value="add">
                <CardContent>
                  {/* {pool.protocol === Protocol.BENTOBOX_CLASSIC ||
                  pool.protocol === Protocol.BENTOBOX_STABLE ? (
                    <AddSectionTrident pool={pool} />
                  ) : null} */}
                  {pool.protocol === Protocol.SUSHISWAP_V2
                    ? // <AddSectionLegacy pool={pool} />
                      null
                    : null}
                </CardContent>
              </TabsContent>
              <TabsContent value="remove">
                {/* <CardContent>
                  {pool.protocol === Protocol.BENTOBOX_CLASSIC ||
                  pool.protocol === Protocol.BENTOBOX_STABLE ? (
                    <RemoveSectionTrident pool={pool} />
                  ) : null}
                  {pool.protocol === Protocol.SUSHISWAP_V2 ? (
                    <RemoveSectionLegacy pool={pool} />
                  ) : null}
                </CardContent> */}
              </TabsContent>
              <TabsContent value="stake">
                <CardContent>
                  <AddSectionStake poolId={pool.id} />
                </CardContent>
              </TabsContent>
              <TabsContent value="unstake">
                <CardContent>
                  <RemoveSectionUnstake poolId={pool.id} />
                </CardContent>
              </TabsContent>
            </PoolPositionRewardsProvider>
          </PoolPositionStakedProvider>
        </PoolPositionProvider>
      </Tabs>
    </Card>
  )
}
