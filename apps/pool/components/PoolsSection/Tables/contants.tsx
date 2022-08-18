import React from 'react'

import { Pair } from '../../../.graphclient'
import { PairWithBalance } from '../../../types'
import { PairAPRCell } from './PairAPRCell'
import { PairChainCell } from './PairChainCell'
import { PairNameCell } from './PairNameCell'
import { PairPositionCell } from './PairPositionCell'
import { PairRewardsCell } from './PairRewardsCell'
import { PairTVLCell } from './PairTVLCell'
import { ExtendedColumnDef } from './types'

export const ICON_SIZE = 26
export const PAGE_SIZE = 20

export const NETWORK_COLUMN: ExtendedColumnDef<Pair, unknown> = {
  id: 'network',
  header: 'Network',
  cell: (props) => <PairChainCell row={props.row.original} />,
  size: 50,
  skeleton: <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />,
}

export const NAME_COLUMN: ExtendedColumnDef<Pair, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PairNameCell row={props.row.original} />,
  size: 160,
  skeleton: (
    <div className="flex items-center gap-2 w-full">
      <div className="flex items-center">
        <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />
        <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse -ml-[12px]" />
      </div>
      <div className="flex flex-col w-full">
        <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />
      </div>
    </div>
  ),
}

export const TVL_COLUMN: ExtendedColumnDef<Pair, unknown> = {
  header: 'TVL',
  id: 'reserveETH',
  accessorFn: (row) => row.reserveETH,
  cell: (props) => <PairTVLCell row={props.row.original} />,
  size: 100,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const APR_COLUMN: ExtendedColumnDef<Pair, unknown> = {
  id: 'apr',
  header: 'APR',
  cell: (props) => <PairAPRCell row={props.row.original} />,
  size: 100,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}

export const REWARDS_COLUMN: ExtendedColumnDef<Pair, unknown> = {
  id: 'rewards',
  header: 'Rewards',
  cell: (props) => <PairRewardsCell row={props.row.original} />,
  skeleton: (
    <div className="flex items-center">
      <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />
      <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse -ml-[12px]" />
    </div>
  ),
}

export const POSITION_COLUMN: ExtendedColumnDef<PairWithBalance, unknown> = {
  id: 'position',
  header: 'Value',
  cell: (props) => <PairPositionCell row={props.row.original} />,
  size: 100,
  skeleton: <div className="rounded-full bg-slate-700 w-full h-[20px] animate-pulse" />,
}
