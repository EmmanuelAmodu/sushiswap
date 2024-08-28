'use client'
import { FormSection } from '@sushiswap/ui'
import { AmountInToken0 } from './AmountInToken0'
import { Plus } from './Plus'
import { AmountInToken1 } from './AmountIntToken1'
import { ReviewAddDialog } from './ReviewAddDialog'

export const DepositForm = () => {
  return (
    <FormSection
      title="Deposit"
      description="Select the amount of tokens you want to deposit"
    >
      <section className="flex flex-col gap-3 relative w-full">
        <AmountInToken0 />
        <Plus />
        <AmountInToken1 />
      </section>
      <div className="flex w-full flex-col">
        <ReviewAddDialog />
      </div>
    </FormSection>
  )
}
