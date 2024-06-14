import { Container } from '@sushiswap/ui'
import { SidebarDesktop, SidebarMobile } from '../../../components/sidebar'
import { AnswerGroup, getFaqAnswerGroup } from '../../../lib/strapi/answerGroup'

export const revalidate = 900

interface AnswerGroupLayoutProps {
  children: React.ReactNode
  params: { 'answer-group-slug': string }
}

function AnswerGroupLayoutDesktop({
  children,
  answerGroup,
}: { children: React.ReactNode; answerGroup: AnswerGroup }) {
  return (
    <Container
      maxWidth="4xl"
      className="flex justify-between pb-40 pt-24 px-8 space-x-16"
    >
      <SidebarDesktop answerGroup={answerGroup} />
      <div className="min-h-full flex dark:bg-slate-600 bg-[#BFBFBF] w-[2px]" />
      {children}
    </Container>
  )
}

function AnswerGroupLayoutMobile({
  children,
  answerGroup,
}: { children: React.ReactNode; answerGroup: AnswerGroup }) {
  return (
    <div className="w-full flex flex-col items-center px-5 pt-8 space-y-8">
      <div className="w-full">
        <SidebarMobile answerGroup={answerGroup} />
      </div>
      {children}
    </div>
  )
}

export async function AnswerGroupLayout({
  children,
  params,
}: AnswerGroupLayoutProps) {
  const answerGroup = await getFaqAnswerGroup(params['answer-group-slug'])

  return (
    <>
      <div className="md:block hidden w-full">
        <AnswerGroupLayoutDesktop answerGroup={answerGroup}>
          {children}
        </AnswerGroupLayoutDesktop>
      </div>
      <div className="w-full md:hidden block">
        <AnswerGroupLayoutMobile answerGroup={answerGroup}>
          {children}
        </AnswerGroupLayoutMobile>
      </div>
    </>
  )
}
