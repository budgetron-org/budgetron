import { differenceInDays, format } from 'date-fns'
import { sql } from 'drizzle-orm'
import { unauthorized } from 'next/navigation'
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { getCurrentUser } from '~/features/auth/service'
import { db } from '~/db'
import { TransactionTypes } from '~/db/enums'
import { CategoryTable, TransactionTable } from '~/db/schema'
import { MAX_STATS_DATE_RANGE_DAYS } from '~/lib/constants'

export async function GET(request: NextRequest) {
  const { user } = await getCurrentUser()
  if (!user) unauthorized()

  const from = request.nextUrl.searchParams.get('from')
  const to = request.nextUrl.searchParams.get('to')
  const type = request.nextUrl.searchParams.get('type')

  const { success, data, error } = GetBudgetStatsSchema.safeParse({
    from,
    to,
    type,
  })

  if (!success) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }

  const result = await getStatsBudgetSpending(
    user.id,
    data.from,
    data.to,
    data.type,
  )

  return NextResponse.json(result)
}

const GetBudgetStatsSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
    type: z.enum(TransactionTypes),
  })
  .refine(({ from, to }) => {
    const days = differenceInDays(to, from)
    return days >= 0 && days <= MAX_STATS_DATE_RANGE_DAYS
  })
type GetBudgetStatsSchemaType = z.infer<typeof GetBudgetStatsSchema>

export type GetBudgetStatsResponse = Awaited<
  ReturnType<typeof getStatsBudgetSpending>
>

async function getStatsBudgetSpending(
  userId: string,
  from: GetBudgetStatsSchemaType['from'],
  to: GetBudgetStatsSchemaType['to'],
  type: GetBudgetStatsSchemaType['type'],
) {
  const transactionTotalByCategory = await db
    .select({
      categoryId: TransactionTable.categoryId,
      categoryName: CategoryTable.name,
      categoryIcon: CategoryTable.icon,
      total: sql<number>`sum(${TransactionTable.amount})`.as('total'),
    })
    .from(TransactionTable)
    .leftJoin(
      CategoryTable,
      sql`${CategoryTable.id} = ${TransactionTable.categoryId}`,
    )
    .where(
      sql`
        ${TransactionTable.userId} = ${userId}
        AND ${TransactionTable.type} = ${type}
        AND ${TransactionTable.categoryId} IS NOT NULL
        AND ${TransactionTable.date} >= ${format(from, 'yyyy-MM-dd')}
        AND ${TransactionTable.date} <= ${format(to, 'yyyy-MM-dd')}
      `,
    )
    .groupBy(
      sql`
        ${TransactionTable.categoryId},
        ${CategoryTable.name},
        ${CategoryTable.icon}
      `,
    )
  const budgets = await db.query.BudgetTable.findMany({
    where: (t, { eq }) => eq(t.userId, userId),
  })

  return {
    budgets: budgets.reduce<
      Record<string, { categoryId: string; amount: string }>
    >((acc, item) => {
      acc[item.categoryId] = {
        categoryId: item.categoryId,
        amount: item.amount.toString(),
      }
      return acc
    }, {}),
    categories: transactionTotalByCategory.reduce<
      Record<string, { id: string; name: string; icon: string }>
    >((acc, item) => {
      // we omit rows without catergory, so categoryId cannot be null
      // but to be safe, we only add if it is not null
      if (item.categoryIcon && item.categoryId && item.categoryName) {
        acc[item.categoryId] = {
          icon: item.categoryIcon,
          id: item.categoryId,
          name: item.categoryName,
        }
      }
      return acc
    }, {}),
    // the category is guaranteed not to be null, so we do !
    summary: transactionTotalByCategory.map((i) => ({
      categoryId: i.categoryId!,
      amount: i.total.toFixed(2) ?? '0.00',
    })),
  }
}
