import { getSwapEdgeConfig } from '~aptos/(common)/lib/edge/get-swap-edge-config'
import { EdgeProvider } from '~aptos/(common)/providers/edge-config-provider'
import { SimpleSwapProvider } from '~aptos/swap/ui/simple/simple-swap-provider/simple-swap-provider'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getSwapEdgeConfig()

  return (
    <EdgeProvider config={config}>
      <SimpleSwapProvider>{children}</SimpleSwapProvider>
    </EdgeProvider>
  )
}
