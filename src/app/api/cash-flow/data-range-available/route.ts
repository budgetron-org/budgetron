import { auth } from '@clerk/nextjs/server'
import { getMonth, getYear } from 'date-fns'

import { monthAggregation } from '@/db/month-aggregation'

export async function GET() {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const { appUserId } = sessionClaims?.metadata ?? {}

  if (!userId || !appUserId) {
    return redirectToSignIn()
  }

  const earliestMonth = await getAvailableDataRange(appUserId)

  return Response.json(earliestMonth)
}

export type GetAvailableDataRangeResponse = Awaited<
  ReturnType<typeof getAvailableDataRange>
>

async function getAvailableDataRange(userId: string) {
  const earliestRecord = await monthAggregation.getEarliest(userId)
  return {
    month: earliestRecord?.month ?? getMonth(Date.now()),
    year: earliestRecord?.year ?? getYear(Date.now()),
  }
}
