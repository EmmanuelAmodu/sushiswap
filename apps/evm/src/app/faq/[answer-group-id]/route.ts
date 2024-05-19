import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { getFaqAnswerGroup } from '../lib/strapi/answerGroup'

export async function GET(request: NextRequest) {
  const pathname = new URL(request.url).pathname
  const answerGroupId = pathname.split('/').slice(-1)[0]
  const answerGroup = await getFaqAnswerGroup(answerGroupId)
  redirect(`${pathname}/${answerGroup.defaultAnswer.slug}`)
}
