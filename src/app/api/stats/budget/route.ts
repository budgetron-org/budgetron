import { auth } from '@clerk/nextjs/server'
import type { TransactionType } from '@prisma/client'
import { NextResponse, type NextRequest } from 'next/server'

import { budget } from '@/db/budget'
import { category } from '@/db/category'
import { transaction } from '@/db/transaction'
import { GetBudgetStatsSchema } from '@/schemas/stats'

export async function GET(request: NextRequest) {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const { appUserId } = sessionClaims?.metadata ?? {}

  if (!userId || !appUserId) {
    return redirectToSignIn()
  }

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
    appUserId,
    data.from,
    data.to,
    data.type,
  )

  return NextResponse.json(result)
}

export type GetBudgetStatsResponse = Awaited<
  ReturnType<typeof getStatsBudgetSpending>
>

async function getStatsBudgetSpending(
  userId: string,
  from: Date,
  to: Date,
  type: TransactionType,
) {
  const summary = await transaction.getSummaryByCategory(userId, from, to, type)
  const categories = await category.findMany({
    where: {
      id: {
        in: summary.map((i) => i.categoryId).filter(Boolean) as string[],
      },
    },
    select: {
      id: true,
      name: true,
      icon: true,
    },
  })
  const budgets = await budget.getAllForUser(userId)

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
    categories: categories.reduce<
      Record<string, { id: string; name: string; icon: string }>
    >((acc, item) => {
      acc[item.id] = {
        icon: item.icon,
        id: item.id,
        name: item.name,
      }
      return acc
    }, {}),
    // the category is guaranteed not to be null, so we do !
    summary: summary.map((i) => ({
      categoryId: i.categoryId!,
      amount: i._sum.amount?.toString() ?? '0',
    })),
  }
}
