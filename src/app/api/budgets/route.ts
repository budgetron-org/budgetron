import { unauthorized } from 'next/navigation'

import { getCurrentUser } from '~/features/auth/service'
import { db } from '~/db'

export async function GET() {
  const { user } = await getCurrentUser()
  if (!user) unauthorized()

  const budget = await getBudgetForUser(user.id)
  return Response.json(budget)
}

export type GetBudgetResponse = Awaited<ReturnType<typeof getBudgetForUser>>

async function getBudgetForUser(userId: string) {
  // get existing budget for this user
  const budgets = await db.query.BudgetTable.findMany({
    where: (t, { eq }) => eq(t.userId, userId),
  })
  // get all expense categories for this user
  const categories = await db.query.CategoryTable.findMany({
    where: (t, { and, eq, or, isNull }) =>
      and(or(eq(t.userId, userId), isNull(t.userId)), eq(t.type, 'expense')),
  })

  // Create a map for both and merge them
  const budgetByCategoryIdMap = budgets.reduce<
    Record<string, (typeof budgets)[number]>
  >((acc, item) => {
    acc[item.categoryId] = item
    return acc
  }, {})

  const result = categories.map((c) => ({
    categoryId: c.id,
    categoryIcon: c.icon,
    categoryName: c.name,
    budgetAmount: budgetByCategoryIdMap[c.id]?.amount ?? null,
  }))

  return result
}
