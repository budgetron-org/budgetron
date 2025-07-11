import { NextRequest, NextResponse } from 'next/server'

import { validateCRONRequest } from '~/lib/cron'
import { JobRegistry } from '~/server/jobs'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ job: string; slug: string }> },
) {
  const { job, slug } = await params
  const { job: validatedJob } = validateCRONRequest(req, slug, job)

  try {
    await JobRegistry[validatedJob]()
    return new NextResponse('Success', { status: 200 })
  } catch (error) {
    console.error(error)
    return new NextResponse('Failed', { status: 500 })
  }
}
