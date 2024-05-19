'use client'

import { classNames } from '@sushiswap/ui'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { AnswerGroup } from '../lib/strapi/answerGroup'

function replaceLast(path: string, search: string, replace: string) {
  const index = path.lastIndexOf(search)

  if (index === -1) return `${path}/${replace}`

  return path.slice(0, index) + replace + path.slice(index + search.length)
}

function SidebarEntry({ answer }: { answer: AnswerGroup['answers'][number] }) {
  const params = useParams<{ 'answer-id': string }>()
  const isActive = params['answer-id'] === answer.slug

  const pathname = usePathname()
  const href = replaceLast(pathname, params['answer-id'], answer.slug)

  return (
    <div
      className={classNames(
        'font-medium w-[160px] max-w-fit',
        isActive
          ? 'dark:text-gray-100'
          : 'dark:text-gray-400 text-[#7F7F7F] dark:hover:text-gray-300',
      )}
    >
      <Link href={href} prefetch={true}>
        {answer.name}
      </Link>
    </div>
  )
}

export function AnswerGroupSidebar({
  answerGroup,
}: { answerGroup: AnswerGroup }) {
  return (
    <div className="space-y-6">
      {answerGroup.answers.map((answer) => (
        <SidebarEntry key={answer.slug} answer={answer} />
      ))}
    </div>
  )
}
