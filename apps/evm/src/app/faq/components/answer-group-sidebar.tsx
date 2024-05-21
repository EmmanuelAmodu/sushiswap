'use client'

import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import { classNames } from '@sushiswap/ui'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
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

export function AnswerGroupSidebarMobile({
  answerGroup,
}: { answerGroup: AnswerGroup }) {
  const params = useParams<{ 'answer-id': string }>()

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(
    answerGroup.answers.find((answer) => answer.slug === params['answer-id'])!,
  )

  const onSelect = useCallback((answer: AnswerGroup['answers'][number]) => {
    setOpen(false)
    // setActive(answer)
  }, [])

  return (
    <div
      className={classNames(
        'font-semibold text-sm transition-[height]  border py-4 px-[18px] rounded-lg',
        'border-[#BFBFBF] bg-[#F2F2F2]',
        'dark:border-[#4D5562] dark:bg-[#252B3A]',
      )}
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
        onKeyUp={() => setOpen(!open)}
      >
        <span>{active.name}</span>
        <div
          className={classNames(
            open && 'rotate-180',
            'transition-all text-[#4D5562] h-6 w-6',
          )}
        >
          <ChevronDownIcon />
        </div>
      </div>
      <div
        className={classNames(
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          'transition-[grid-template-rows] grid [&>*]:overflow-hidden',
        )}
      >
        <div className="space-y-3">
          <div className="h-3" />
          {answerGroup.answers.map((answer) => (
            <div
              key={answer.slug}
              onClick={() => onSelect(answer)}
              onKeyUp={() => onSelect(answer)}
            >
              <SidebarEntry answer={answer} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AnswerGroupSidebarDesktop({
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
