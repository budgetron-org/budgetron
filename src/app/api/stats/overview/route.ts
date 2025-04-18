import { differenceInDays, format } from 'date-fns'
import { sql } from 'drizzle-orm'
import { unauthorized } from 'next/navigation'
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { getCurrentUser } from '~/features/auth/service'
import { db } from '~/db'
import { TransactionTable } from '~/db/schema'
import { MAX_STATS_DATE_RANGE_DAYS } from '~/lib/constants'

export async function GET(request: NextRequest) {
  const { user } = await getCurrentUser()
  if (!user) unauthorized()

  const from = request.nextUrl.searchParams.get('from')
  const to = request.nextUrl.searchParams.get('to')

  const {
    success,
    data: range,
    error,
  } = GetOverviewStatsSchema.safeParse({ from, to })

  if (!success) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }

  const result = await getStatsOverviewFromRange(user.id, range.from, range.to)
  return NextResponse.json(result)
}

const GetOverviewStatsSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine(({ from, to }) => {
    const days = differenceInDays(to, from)
    return days >= 0 && days <= MAX_STATS_DATE_RANGE_DAYS
  })

export type GetOverviewStatsResponse = Awaited<
  ReturnType<typeof getStatsOverviewFromRange>
>

async function getStatsOverviewFromRange(userId: string, from: Date, to: Date) {
  const rows = await db
    .select({
      type: TransactionTable.type,
      total: sql<number>`sum(${TransactionTable.amount})`.as('total'),
    })
    .from(TransactionTable)
    .where(
      sql`
        ${TransactionTable.userId} = ${userId}
        AND ${TransactionTable.date} >= ${format(from, 'yyyy-MM-dd')}
        AND ${TransactionTable.date} <= ${format(to, 'yyyy-MM-dd')}
      `,
    )
    .groupBy(TransactionTable.type)

  let expense = 0
  let income = 0

  for (const row of rows) {
    if (row.type === 'expense') expense += Number(row.total)
    if (row.type === 'income') income += Number(row.total)
  }

  return {
    expense: expense.toFixed(2),
    income: income.toFixed(2),
  }
}
