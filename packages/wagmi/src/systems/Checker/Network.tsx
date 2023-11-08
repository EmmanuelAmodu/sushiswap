'use client'

import { Button, ButtonProps } from '@sushiswap/ui/components/button'
import { FC, ReactElement } from 'react'
import { chainName } from 'sushi/chain'
import { useNetwork, useSwitchNetwork } from 'wagmi'

interface NetworkProps extends ButtonProps {
  chainId: number | undefined
}

const Network: FC<NetworkProps> = ({
  chainId,
  fullWidth = true,
  size = 'xl',
  children,
  ...rest
}): ReactElement<any, any> | null => {
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  if (!chainId) return null

  const _chainId = Number(chainId)
  if (chain?.id !== _chainId)
    return (
      <Button
        fullWidth={fullWidth}
        size={size}
        onClick={() => switchNetwork?.(_chainId)}
        {...rest}
      >
        Switch to {chainName[_chainId]}
      </Button>
    )

  return <>{children}</>
}

export { Network, type NetworkProps }
