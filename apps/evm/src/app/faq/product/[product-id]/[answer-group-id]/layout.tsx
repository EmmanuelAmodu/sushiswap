import { Breadcrumb, Container, typographyVariants } from '@sushiswap/ui'
import React from 'react'
import { getFaqAnswerGroup } from 'src/app/faq/lib/strapi/answerGroup'
import AnswerGroupLayout from '../../../components/answer-group-layout'

export const revalidate = 900

// Prepared for product-specific styling
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { 'answer-group-id': string }
}) {
  const answerGroup = await getFaqAnswerGroup(params['answer-group-id'])

  return (
    <div>
      <div className="dark:bg-[#19202F]">
        <Container maxWidth="6xl" className="px-4">
          <Breadcrumb replace={{ '-': ' ' }} truncate={false} />
        </Container>
        <Container maxWidth="6xl" className="pt-6 px-4 pb-14">
          <h1 className={typographyVariants({ variant: 'h1' })}>
            {answerGroup.name}
          </h1>
        </Container>
      </div>
      <AnswerGroupLayout params={params}>{children}</AnswerGroupLayout>
    </div>
  )
}
