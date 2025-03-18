import { auth } from '@clerk/nextjs/server'
import { getYear } from 'date-fns'
import { NextResponse } from 'next/server'

import { yearAggregation } from '@/db/year-aggregation'
import { range } from 'lodash'

export async function GET() {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const { appUserId } = sessionClaims?.metadata ?? {}

  if (!userId || !appUserId) {
    return redirectToSignIn()
  }

  const result = await getYTDSummary(appUserId)

  return NextResponse.json(result)
}

export type GetYTDSummaryResponse = Awaited<ReturnType<typeof getYTDSummary>>

async function getYTDSummary(userId: string) {
  const summary = await yearAggregation.getSummaryForYear(
    userId,
    getYear(Date.now()),
  )

  const summaryMap = summary.reduce(
    (acc, i) => {
      acc[i.month] = {
        income: i.income?.toString() ?? '0',
        expense: i.spending?.toString() ?? '0',
      }
      return acc
    },
    {} as Record<number, { income: string; expense: string }>,
  )

  // fill missing months and return
  return range(10).map((month) => {
    if (month in summaryMap) return summaryMap[month]
    return { income: '0', expense: '0' }
  })
}
