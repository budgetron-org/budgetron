import {
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
} from 'date-fns'
import { sql } from 'drizzle-orm'
import { groupBy, range } from 'lodash'
import { unauthorized } from 'next/navigation'
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { getCurrentUser } from '~/features/auth/service'
import { db } from '~/db'
import { TransactionTable } from '~/db/schema'

export async function GET(request: NextRequest) {
  const { user } = await getCurrentUser()
  if (!user) unauthorized()

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
    user.id,
    data.timeFrame,
    data.month,
    data.year,
  )

  return NextResponse.json(result)
}

export type GetCashFlowStatsResponse = Awaited<
  ReturnType<typeof getCashFlowStats>
>

const validMonths = range(0, 12)
const GetCashFlowStatsSchema = z.object({
  timeFrame: z.enum(['month', 'year']),
  month: z.coerce
    .number()
    .refine(
      (val) => validMonths.includes(val),
      'Enter a valid month (0 to 11)',
    ),
  year: z.coerce.number(),
})
type GetCashFlowStatsSchema = z.infer<typeof GetCashFlowStatsSchema>

async function getCashFlowStats(
  userId: string,
  timeFrame: GetCashFlowStatsSchema['timeFrame'],
  month: GetCashFlowStatsSchema['month'],
  year: GetCashFlowStatsSchema['year'],
) {
  const isMonthly = timeFrame === 'month'
  const startDate = isMonthly
    ? startOfMonth(new Date(year, month - 1))
    : startOfYear(new Date(year, 0))
  const endDate = isMonthly ? endOfMonth(startDate) : endOfYear(startDate)
  const labelFormat = isMonthly ? 'yyyy-MM-dd' : 'yyyy-MM'

  const result = await db
    .select({
      label:
        sql<string>`to_char(${TransactionTable.date}, '${labelFormat}')`.as(
          'label',
        ),
      type: TransactionTable.type,
      total: sql<number>`sum(${TransactionTable.amount})`.as('total'),
    })
    .from(TransactionTable)
    .where(
      sql`
        ${TransactionTable.userId} = ${userId}
        AND ${TransactionTable.date} >= ${format(startDate, 'yyyy-MM-dd')}
        AND ${TransactionTable.date} <= (${format(endDate, 'yyyy-MM-dd')})
      `,
    )
    .groupBy(sql`label, ${TransactionTable.type}`)
    .orderBy(sql`label`)

  // if no data, then return an empty array
  if (result.length === 0) return []

  const grouped = groupBy(result, (r) => r.label)

  const allLabels = isMonthly
    ? eachDayOfInterval({ start: startDate, end: endDate }).map((d) =>
        format(d, labelFormat),
      )
    : eachMonthOfInterval({ start: startDate, end: endDate }).map((d) =>
        format(d, labelFormat),
      )
  return allLabels.map((label) => {
    const rows = grouped[label] ?? []
    let income = 0
    let expense = 0

    for (const row of rows) {
      if (row.type === 'income') income += Number(row.total)
      if (row.type === 'expense') expense += Number(row.total)
    }

    return {
      label,
      income: income.toFixed(2),
      expense: expense.toFixed(2),
    }
  })
}
