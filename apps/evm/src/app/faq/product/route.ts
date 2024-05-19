import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const pathname = new URL(request.url).pathname
  const prevPathname = pathname.split('/').slice(0, -1).join('/')
  redirect(prevPathname)
}
