import { getFaqAnswerGroup } from '../lib/strapi/answerGroup'
import { AnswerGroupSidebar } from './answer-group-sidebar'

export default async function AnswerGroupLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { 'answer-group-id': string }
}) {
  const answerGroup = await getFaqAnswerGroup(params['answer-group-id'])

  return (
    <div className="border-t border-accent w-full flex justify-center pb-40 pt-24">
      <div className="max-w-6xl lg:px-[120px] md:px-[80px] w-full px-5 flex space-x-16">
        <AnswerGroupSidebar answerGroup={answerGroup} />
        <div className="min-h-full flex bg-slate-600 w-[2px]" />
        {children}
      </div>
    </div>
  )
}
