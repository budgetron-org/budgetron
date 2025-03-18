import { auth } from '@clerk/nextjs/server'

import { budget } from '@/db/budget'
import { category } from '@/db/category'

export async function GET() {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const { appUserId } = sessionClaims?.metadata ?? {}

  if (!userId || !appUserId) {
    return redirectToSignIn()
  }

  const budget = await getBudgetForUser(appUserId)
  return Response.json(budget)
}

export type GetBudgetResponse = Awaited<ReturnType<typeof getBudgetForUser>>

async function getBudgetForUser(userId: string) {
  // get existing budget for this user
  const budgets = await budget.getAllForUser(userId)
  // get all expense categories for this user
  const categories = await category.findMany({
    where: { OR: [{ userId }, { userId: null }], type: 'expense' },
  })

  // Create a map for both and merge them
  const budgetByCategoryIdMap = budgets.reduce(
    (acc, item) => {
      acc[item.categoryId] = item
      return acc
    },
    {} as Record<string, (typeof budgets)[number]>,
  )

  const result = categories.map((c) => ({
    categoryId: c.id,
    categoryIcon: c.icon,
    categoryName: c.name,
    budgetAmount: (budgetByCategoryIdMap[c.id]?.amount?.toString() ?? null) as
      | string
      | null,
  }))

  return result
}
