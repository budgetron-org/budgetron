import 'server-only'

import { notFound } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { env } from '~/env/server'
import { JobRegistry } from '~/server/jobs'

const VALID_SLUG = env.CRON_SECRET_SLUG
const VALID_TOKEN = env.CRON_SECRET_TOKEN

function validateCRONRequest(request: NextRequest, slug: string, job: string) {
  const token = request.headers.get('x-cron-secret')
  const isAuthorized = slug === VALID_SLUG && token === VALID_TOKEN
  // Always do a 404 to prevent leaking information about valid jobs
  if (!isAuthorized || !(job in JobRegistry)) notFound()
  return { job: job as keyof typeof JobRegistry }
}

export { validateCRONRequest }
