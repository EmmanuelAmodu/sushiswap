import { getSmartPools } from '@sushiswap/graph-client/data-api'
import { STEER_SUPPORTED_CHAIN_IDS } from '@sushiswap/steer-sdk'
import { Container } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import React, { FC, Suspense } from 'react'
import { SmartPoolsTable } from 'src/ui/pool/SmartPoolsTable'
import { TableFiltersFarmsOnly } from 'src/ui/pool/TableFiltersFarmsOnly'
import { TableFiltersNetwork } from 'src/ui/pool/TableFiltersNetwork'
import { TableFiltersPoolType } from 'src/ui/pool/TableFiltersPoolType'
import { TableFiltersResetButton } from 'src/ui/pool/TableFiltersResetButton'
import { TableFiltersSearchToken } from 'src/ui/pool/TableFiltersSearchToken'
import { ChainId } from 'sushi/chain'

const _SmartPoolsTable: FC<{ chainId: ChainId }> = async ({ chainId }) => {
  const smartPools = await unstable_cache(
    async () =>
      getSmartPools({ chainId }).then((smartPools) =>
        smartPools.filter((smartPool) => smartPool.isEnabled),
      ),
    ['smart-pools', `${chainId}`],
    {
      revalidate: 60 * 15,
    },
  )()

  return <SmartPoolsTable smartPools={smartPools} />
}

export default async function SmartPoolsPage({
  params,
}: {
  params: { chainId: string }
}) {
  const chainId = +params.chainId as ChainId
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="flex flex-wrap gap-3 mb-4">
        <TableFiltersSearchToken />
        <TableFiltersPoolType />
        <TableFiltersNetwork
          chainId={chainId}
          chainIds={STEER_SUPPORTED_CHAIN_IDS}
        />
        <TableFiltersFarmsOnly />
        <TableFiltersResetButton />
      </div>
      <Suspense fallback={<SmartPoolsTable isLoading={true} />}>
        <_SmartPoolsTable chainId={chainId} />
      </Suspense>
    </Container>
  )
}
