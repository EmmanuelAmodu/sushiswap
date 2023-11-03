import { AngleRewardsPool } from '@sushiswap/react-query'
import { Row } from '@tanstack/react-table'
import { FC, useMemo } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { formatNumber } from 'sushi/format'

export const RewardsV3ClaimableCell: FC<Row<AngleRewardsPool>> = ({
  original,
}) => {
  const unclaimed = useMemo(
    () => Object.values(original.rewardsPerToken).map((el) => el.unclaimed),
    [original],
  )
  const dollarValues = useTokenAmountDollarValues({
    chainId: original.chainId,
    amounts: unclaimed,
  })

  return `$${dollarValues.reduce((acc, cur) => acc + +formatNumber(cur), 0)}`
}
