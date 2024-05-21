import { Container } from '@sushiswap/ui'
import { AnswerGroupAnswerSelector } from '../../../components/answer-group-answer-selector'
import { getFaqTopic } from '../../../lib/strapi/topic'

export const revalidate = 900

export default async function FaqTopicPage({
  params,
}: {
  params: { 'topic-id': string }
}) {
  const topic = await getFaqTopic(params['topic-id'])

  return (
    <Container maxWidth="6xl" className="px-4">
      <AnswerGroupAnswerSelector data={topic} />
    </Container>
  )
}
