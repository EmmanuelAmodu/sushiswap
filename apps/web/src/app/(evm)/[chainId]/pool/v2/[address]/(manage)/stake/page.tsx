import { V2Pool, getV2Pool } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import {
  PoolPositionProvider,
  PoolPositionRewardsProvider,
  PoolPositionStakedProvider,
} from 'src/ui/pool'
import { ManageV2LiquidityCard } from 'src/ui/pool/ManageV2LiquidityCard'
import { PoolMyRewards } from 'src/ui/pool/PoolMyRewards'
import { PoolPosition } from 'src/ui/pool/PoolPosition'
import { ChainId } from 'sushi/chain'

export default async function ManageV2PoolPage({
  params,
}: {
  params: { chainId: string; address: string }
}) {
  const { chainId: _chainId, address } = params
  const chainId = +_chainId as ChainId
  const pool = (await unstable_cache(
    async () => getV2Pool({ chainId, address }),
    ['pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()) as V2Pool

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_400px] gap-6">
      <div>
        <ManageV2LiquidityCard pool={pool} tab="stake" />
      </div>
      <div className="flex flex-col gap-6">
        <PoolPositionProvider pool={pool}>
          <PoolPositionStakedProvider pool={pool}>
            <PoolPositionRewardsProvider pool={pool}>
              <PoolPosition pool={pool} />
              <PoolMyRewards pool={pool} />
            </PoolPositionRewardsProvider>
          </PoolPositionStakedProvider>
        </PoolPositionProvider>
      </div>
    </div>
  )
}
