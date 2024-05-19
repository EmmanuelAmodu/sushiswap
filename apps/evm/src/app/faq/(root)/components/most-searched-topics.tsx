import { ChevronRightIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import {
  MostSearchedListEntry,
  getFaqMostSearchedList,
} from '../../lib/strapi/mostSearchedQuestionList'

function Question({ question, url }: MostSearchedListEntry) {
  return (
    <div className="">
      <Link
        href={url}
        className="flex flex-row items-center justify-between space-x-4"
        prefetch={true}
      >
        <div className="dark:hover:text-slate-300 hover:text-neutral-600">
          {question}
        </div>
        <div>
          <ChevronRightIcon width={28} height={28} />
        </div>
      </Link>
    </div>
  )
}

function MostSearchedTopicsDesktop({
  questions,
}: { questions: MostSearchedListEntry[] }) {
  const firstHalf = questions.slice(0, Math.ceil(questions.length / 2))
  const secondHalf = questions.slice(Math.ceil(questions.length / 2))

  return (
    <div className="grid grid-cols-2 gap-x-16 lg:gap-x-24">
      <div className="divide-y divide-slate-500 divide-opacity-50">
        {firstHalf.map((topic, i) => (
          <div key={i} className="pt-2.5 pb-2.5 first:pt-0 last:pb-0">
            <Question {...topic} />
          </div>
        ))}
      </div>
      <div className="divide-y divide-slate-500 divide-opacity-50">
        {secondHalf.map((topic, i) => (
          <div key={i} className="pt-2.5 pb-2.5 first:pt-0 last:pb-0">
            <Question {...topic} />
          </div>
        ))}
      </div>
    </div>
  )
}

function MostSearchedTopicsMobile({
  questions,
}: { questions: MostSearchedListEntry[] }) {
  return (
    <div className="divide-y divide-slate-500 divide-opacity-50 gap-y-4">
      {questions.map((topic, i) => (
        <div key={i} className="first:pt-0 py-3 last:pb-0">
          <Question {...topic} />
        </div>
      ))}
    </div>
  )
}

export async function MostSearchedTopics() {
  const questions = await getFaqMostSearchedList()

  return (
    <div className="flex flex-col space-y-8 md:space-y-12">
      <div className="text-2xl font-medium">Most Searched Topics</div>

      <div>
        <div className="md:block hidden">
          <MostSearchedTopicsDesktop questions={questions} />
        </div>
        <div className="md:hidden block">
          <MostSearchedTopicsMobile questions={questions} />
        </div>
      </div>
    </div>
  )
}
