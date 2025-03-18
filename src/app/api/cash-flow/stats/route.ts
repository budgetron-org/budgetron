import { auth } from '@clerk/nextjs/server'
import { NextResponse, type NextRequest } from 'next/server'
import type { z } from 'zod'

import { GetCashFlowStatsSchema } from '@/schemas/cash-flow'
import { monthAggregation } from '@/db/month-aggregation'
import { getDaysInMonth } from 'date-fns'
import { range } from 'lodash'
import { yearAggregation } from '@/db/year-aggregation'
import { MONTH_NAMES } from '@/lib/constants'

type GetCashFlowStatsSchema = z.infer<typeof GetCashFlowStatsSchema>

export async function GET(request: NextRequest) {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const { appUserId } = sessionClaims?.metadata ?? {}

  if (!userId || !appUserId) {
    return redirectToSignIn()
  }

  const timeFrame = request.nextUrl.searchParams.get('timeFrame')
  const month = request.nextUrl.searchParams.get('month')
  const year = request.nextUrl.searchParams.get('year')

  const { success, data, error } = GetCashFlowStatsSchema.safeParse({
    timeFrame,
    month,
    year,
  })

  if (!success) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }

  const result = await getCashFlowStats(
    appUserId,
    data.timeFrame,
    data.month,
    data.year,
  )

  return NextResponse.json(result)
}

export type GetCashFlowStatsResponse = Awaited<
  ReturnType<typeof getCashFlowStats>
>

async function getCashFlowStats(
  userId: string,
  timeFrame: GetCashFlowStatsSchema['timeFrame'],
  month: GetCashFlowStatsSchema['month'],
  year: GetCashFlowStatsSchema['year'],
) {
  if (timeFrame === 'month') {
    const queryResult = await monthAggregation.getSummaryForMonth(
      userId,
      month,
      year,
    )

    // if no data, then return an empty array
    if (queryResult.length === 0) return []

    const resultMap = queryResult.reduce(
      (acc, row) => {
        acc[row.day] = row
        return acc
      },
      {} as Record<number, (typeof queryResult)[number]>,
    )
    const daysInMonth = getDaysInMonth(new Date(year, month))

    return range(1, daysInMonth + 1).map((day) =>
      day in resultMap
        ? {
            label: resultMap[day].day.toString(),
            income: resultMap[day].income.toString(),
            expense: resultMap[day].spending.toString(),
          }
        : {
            label: day.toString(),
            income: '0',
            expense: '0',
          },
    )
  }

  const queryResult = await yearAggregation.getSummaryForYear(userId, year)

  // if no data, then return an empty array
  if (queryResult.length === 0) return []

  const resultMap = queryResult.reduce(
    (acc, row) => {
      acc[row.month] = row
      return acc
    },
    {} as Record<number, (typeof queryResult)[number]>,
  )

  return range(0, 12).map((month) =>
    month in resultMap
      ? {
          label: MONTH_NAMES[month],
          income: resultMap[month].income.toString(),
          expense: resultMap[month].spending.toString(),
        }
      : {
          label: MONTH_NAMES[month],
          income: '0',
          expense: '0',
        },
  )
}
