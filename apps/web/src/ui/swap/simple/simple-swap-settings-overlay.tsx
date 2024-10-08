'use client'

import { SettingsModule, SettingsOverlay } from '@sushiswap/ui'
import { SwapApi } from './swap-api-setting'

export const SimpleSwapSettingsOverlay = () => {
  return (
    <SettingsOverlay
      modules={[
        SettingsModule.SlippageTolerance,
        // SettingsModule.ExpertMode,
        // SettingsModule.TransactionDeadline,
        // SettingsModule.CarbonOffset
      ]}
      externalModules={[SwapApi]}
    />
  )
}
