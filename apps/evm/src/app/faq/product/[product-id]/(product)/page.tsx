import { Container } from '@sushiswap/ui'
import { getFaqProduct } from 'src/app/faq/lib/strapi/product'
import { AnswerGroupAnswerSelector } from '../../../components/answer-group-answer-selector'

export default async function FaqProductPage({
  params,
}: {
  params: { 'product-id': string }
}) {
  const product = await getFaqProduct(params['product-id'])

  return (
    <Container maxWidth="6xl" className="px-4">
      <AnswerGroupAnswerSelector data={product} />
    </Container>
  )
}
