import { Breadcrumb, Container, typographyVariants } from '@sushiswap/ui'
import React from 'react'
import { getFaqCategory } from '../../lib/strapi/category'

export const revalidate = 900

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { 'category-slug': string }
}) {
  const category = await getFaqCategory(params['category-slug'])

  return (
    <>
      <div className="dark:bg-[#19202F] bg-[#414a6c05]">
        <Container maxWidth="4xl" className="px-5 md:px-8 pb-14 space-y-6">
          <Breadcrumb replace={{ '-': ' ' }} truncate={false} />

          <h1 className={typographyVariants({ variant: 'h1' })}>
            {category.name}
          </h1>
        </Container>
      </div>
      <div className="h-[0.5px] bg-accent w-full" />
      <Container
        maxWidth="4xl"
        className="px-5 md:px-8 flex md:pb-40 md:pt-24 pt-8"
      >
        {children}
      </Container>
    </>
  )
}
