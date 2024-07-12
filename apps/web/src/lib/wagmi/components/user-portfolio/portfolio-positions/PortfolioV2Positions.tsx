import { PortfolioV2Position } from '@sushiswap/graph-client/data-api'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Currency,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import React, { FC } from 'react'
import { formatUSD } from 'sushi/format'

interface PortfolioV2PositionssProps {
  positions: PortfolioV2Position[]
}

export const PortfolioV2Positions: FC<PortfolioV2PositionssProps> = ({
  positions,
}) => (
  <AccordionItem value="v2" className="!border-0">
    <AccordionTrigger className="px-5 underline-offset-2">
      {`V2 Positions (${positions.length})`}
    </AccordionTrigger>
    <AccordionContent className="cursor-default">
      {positions.map((position) => (
        <div
          id={`${position.chainId}:${position.id}`}
          className="flex justify-between items-center hover:bg-muted px-5 py-3 gap-x-4"
        >
          <div className="flex gap-x-4 items-center whitespace-nowrap overflow-hidden">
            <div className="shrink-0">
              <Badge
                className="border-1 border-background bg-background rounded-full z-[11] right-[-0.225rem] bottom-[-0.225rem]"
                position="bottom-right"
                badgeContent={
                  <NetworkIcon
                    chainId={position.chainId}
                    width={14}
                    height={14}
                  />
                }
              >
                <Currency.IconList iconWidth={28} iconHeight={28}>
                  <img
                    className="rounded-full"
                    src={position.token0.logoUrl}
                    alt={position.token0.symbol}
                  />
                  <img
                    className="rounded-full"
                    src={position.token1.logoUrl}
                    alt={position.token1.symbol}
                  />
                </Currency.IconList>
              </Badge>
            </div>
            <div className="overflow-hidden flex flex-col gap-y-1">
              <div className="text-sm font-medium overflow-ellipsis overflow-hidden">
                {position.name}
              </div>
              <div className="text-muted-foreground text-xs">V2-0.30%</div>
            </div>
          </div>
          <div className="text-right text-sm font-medium">
            {formatUSD(position.amountUSD)}
          </div>
        </div>
      ))}
    </AccordionContent>
  </AccordionItem>
)
