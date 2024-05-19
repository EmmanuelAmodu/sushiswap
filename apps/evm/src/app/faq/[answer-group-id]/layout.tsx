import { Breadcrumb, Container, typographyVariants } from '@sushiswap/ui'
import React from 'react'
import AnswerGroupLayout from '../components/answer-group-layout'
import { getFaqAnswerGroup } from '../lib/strapi/answerGroup'

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
      <div className="dark:bg-[#19202F] bg-[#414a6c05]">
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
