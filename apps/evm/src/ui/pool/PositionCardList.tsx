import { Protocol } from '@sushiswap/client'
import { V2Position } from '@sushiswap/rockset-client'
import { useAccount } from '@sushiswap/wagmi'
import { SUPPORTED_CHAIN_IDS } from 'src/config'
import { useV2Positions } from 'src/lib/flair/hooks/positions/v2/v2'
import React, { FC, ReactNode } from 'react'
import { PositionWithPool2 } from 'src/types'

interface PositionCardList {
  children({
    positions,
    isLoading,
  }: { positions: PositionWithPool2[]; isLoading: boolean }): ReactNode
}

const value = (position: V2Position) =>
  (Number(position.balance) / Number(position.pool.liquidity)) *
  Number(position.pool.liquidityUSD)

export const PositionCardList: FC<PositionCardList> = ({ children }) => {
  const { address } = useAccount()
  const { data: userPositions, isLoading } = useV2Positions(
    {
      user: address!,
      chainIds: SUPPORTED_CHAIN_IDS,
    },
    { enabled: !!address },
  )

  return (
    <>
      {children({
        positions: isLoading
          ? new Array(6).fill(null)
          : (userPositions || [])
              .filter((el) => el.pool.protocol === Protocol.SUSHISWAP_V2)
              .sort((a, b) => value(b) - value(a)),
        isLoading: isLoading,
      })}
    </>
  )
}
