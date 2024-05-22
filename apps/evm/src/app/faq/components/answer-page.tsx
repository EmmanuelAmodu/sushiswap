import { getFaqAnswer } from '../lib/strapi/answer'

export async function AnswerPage({
  params,
}: { params: { 'answer-id': string } }) {
  const answer = await getFaqAnswer(params['answer-id'])

  return (
    <div
      className="prose dark:!prose-invert prose-slate w-full"
      dangerouslySetInnerHTML={{
        __html: answer.body || '',
      }}
    />
  )
}
