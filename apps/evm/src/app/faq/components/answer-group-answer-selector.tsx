'use client'

import { classNames } from '@sushiswap/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Product } from '../lib/strapi/product'
import { Topic } from '../lib/strapi/topic'

export function AnswerGroupAnswerSelector({ data }: { data: Topic & Product }) {
  const pathname = usePathname()

  const [selectedAnswerGroup, setSelectedAnswerGroup] = useState(
    data.answerGroups[0],
  )

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 text-3xl font-semibold">
        <div className="px-12">Questions</div>
        <div className="px-12">Answers</div>
      </div>
      <div className="grid grid-cols-2 divide-x gap-2 text-xl divide-slate-400">
        <div className="px-12 space-y-6 font-medium">
          {data.answerGroups.map((group) => (
            <div
              key={group.slug}
              className={classNames(
                selectedAnswerGroup.slug !== group.slug &&
                  'dark:text-slate-400 text-neutral-500',
              )}
            >
              <Link
                href={`${pathname}/${group.slug}/${group.defaultAnswer.slug}`}
                onFocus={() => setSelectedAnswerGroup(group)}
                onMouseOver={() => setSelectedAnswerGroup(group)}
              >
                {group.name}
              </Link>
            </div>
          ))}
        </div>
        <div className="px-12 space-y-6">
          {selectedAnswerGroup.answers.map((answer) => (
            <div
              key={answer.slug}
              className="dark:hover:text-inherit dark:text-slate-400 hover:text-neutral-700"
            >
              <Link
                href={`${pathname}/${selectedAnswerGroup.slug}/${answer.slug}`}
              >
                {answer.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
