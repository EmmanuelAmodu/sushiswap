import { AnswerGroup, getFaqAnswerGroup } from '../lib/strapi/answerGroup'
import {
  AnswerGroupSidebarDesktop,
  AnswerGroupSidebarMobile,
} from './answer-group-sidebar'

export const revalidate = 900

interface AnswerGroupLayoutProps {
  children: React.ReactNode
  params: { 'answer-group-id': string }
}

function AnswerGroupLayoutDesktop({
  children,
  answerGroup,
}: { children: React.ReactNode; answerGroup: AnswerGroup }) {
  return (
    <div className="max-w-6xl lg:px-[120px] md:px-[80px] w-full px-5 flex space-x-16 pb-40 pt-24">
      <AnswerGroupSidebarDesktop answerGroup={answerGroup} />
      <div className="min-h-full flex dark:bg-slate-600 bg-[#BFBFBF] w-[2px]" />
      {children}
    </div>
  )
}

function AnswerGroupLayoutMobile({
  children,
  answerGroup,
}: { children: React.ReactNode; answerGroup: AnswerGroup }) {
  return (
    <div className="w-full px-5 pt-8 space-y-8">
      <AnswerGroupSidebarMobile answerGroup={answerGroup} />
      {children}
    </div>
  )
}

export default async function AnswerGroupLayout({
  children,
  params,
}: AnswerGroupLayoutProps) {
  const answerGroup = await getFaqAnswerGroup(params['answer-group-id'])

  return (
    <div className="border-t border-accent w-full">
      <div className="md:flex hidden w-full justify-center">
        <AnswerGroupLayoutDesktop answerGroup={answerGroup}>
          {children}
        </AnswerGroupLayoutDesktop>
      </div>
      <div className="w-full md:hidden flex justify-center">
        <AnswerGroupLayoutMobile answerGroup={answerGroup}>
          {children}
        </AnswerGroupLayoutMobile>
      </div>
    </div>
  )
}
