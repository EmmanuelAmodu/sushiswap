import { FC } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardGroup,
  CardHeader,
  CardLabel,
  CardTitle,
} from '@sushiswap/ui'
import { CardItem } from '@sushiswap/ui'

export const PoolRewards: FC<{ isFarm: boolean; rewardsPerDay: number }> = ({
  rewardsPerDay,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rewards</CardTitle>
        <CardDescription>
          Distributed to everyone who provides liquidity to this pool. <br />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardGroup>
          <CardLabel>Tokens (per day)</CardLabel>
          <CardItem
            title={
              <div className="font-medium flex items-center gap-2 text-muted-foreground">
                <img
                  src="https://cryptototem.com/wp-content/uploads/2022/08/aptos-logo.jpg"
                  className="rounded-full"
                  height={18}
                  width={18}
                  alt=""
                />{' '}
                APT
              </div>
            }
          >
            <span className="flex gap-1 font-semibold">{rewardsPerDay} </span>
          </CardItem>
        </CardGroup>
      </CardContent>
    </Card>
  )
}
