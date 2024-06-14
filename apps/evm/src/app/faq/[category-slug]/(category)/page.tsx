import { Container } from '@sushiswap/ui'
import { getFaqCategory } from '../../lib/strapi/category'
import { AnswerGroupAnswerSelector } from '../[answer-group-slug]/components/answer-group-answer-selector'

export const revalidate = 900

export default async function FaqCategoryPage({
  params,
}: {
  params: { 'category-slug': string }
}) {
  const category = await getFaqCategory(params['category-slug'])

  return (
    <Container maxWidth="6xl" className="px-4">
      <AnswerGroupAnswerSelector data={category} />
    </Container>
  )
}
