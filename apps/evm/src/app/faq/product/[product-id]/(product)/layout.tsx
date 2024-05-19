import { Breadcrumb, Container, typographyVariants } from '@sushiswap/ui'
import React from 'react'
import { getFaqProduct } from 'src/app/faq/lib/strapi/product'

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { 'product-id': string }
}) {
  const product = await getFaqProduct(params['product-id'])

  return (
    <>
      <div className="dark:bg-[#19202F] bg-[#414a6c05]">
        <Container maxWidth="6xl" className="px-4">
          <Breadcrumb replace={{ '-': ' ' }} truncate={false} />
        </Container>
        <Container maxWidth="6xl" className="pt-6 px-4 pb-14">
          <h1 className={typographyVariants({ variant: 'h1' })}>
            {product.name}
          </h1>
        </Container>
      </div>
      <div className="border-t border-accent w-full flex justify-center pb-40 pt-24">
        <div className="max-w-6xl lg:px-[120px] md:px-[80px] w-full px-5 flex">
          {children}
        </div>
      </div>
    </>
  )
}
