import {
  type NavigationElement,
  NavigationElementType,
  NavigationListItem,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
  OnramperButton,
} from '@sushiswap/ui'
import {
  EXPLORE_NAVIGATION_LINKS,
  // MORE_NAVIGATION_LINKS,
} from 'src/app/_common/header-elements'
import { ChainId, ChainKey, isChainId } from 'sushi'

interface HeaderElements {
  chainId?: ChainId
  includeOnramper?: boolean
}

export const headerElements = (
  { chainId, includeOnramper }: HeaderElements = { includeOnramper: true },
): NavigationElement[] => [
  {
    title: 'Explore',
    items: EXPLORE_NAVIGATION_LINKS(chainId),
    show: 'mobile',
    type: NavigationElementType.Dropdown,
  },
  {
    show: 'desktop',
    type: NavigationElementType.Custom,
    href: '/swap',
    item: (
      <NavigationMenuItem className={NavigationElementType.Custom}>
        <NavigationMenuTrigger>Trade</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-[400px] gap-3 p-4">
            <NavigationListItem title={'Swap'} href={'/swap'}>
              The easiest way to trade.
            </NavigationListItem>
            {includeOnramper ? (
              <OnramperButton>
                <NavigationListItem title={'Buy Crypto'}>
                  Onramp with fiat.
                </NavigationListItem>
              </OnramperButton>
            ) : null}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    ),
  },
  {
    title: 'Explore',
    href: `/${
      isChainId(Number(chainId)) ? ChainKey[chainId as ChainId] : 'ethereum'
    }/explore/pools`,
    show: 'desktop',
    type: NavigationElementType.Single,
  },
  {
    title: 'Pool',
    href: `/${
      isChainId(Number(chainId)) ? ChainKey[chainId as ChainId] : 'ethereum'
    }/pool`,
    show: 'desktop',
    type: NavigationElementType.Single,
  },
  {
    title: 'Stake',
    href: '/stake',
    show: 'desktop',
    type: NavigationElementType.Single,
  },
  // {
  //   title: 'More',
  //   items: MORE_NAVIGATION_LINKS,
  //   show: 'desktop',
  //   type: NavigationElementType.Dropdown,
  // },
]
