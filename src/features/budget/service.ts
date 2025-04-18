import { sql } from 'drizzle-orm'

import { db } from '~/db'
import { BudgetTable } from '~/db/schema'
import { revalidateBudgetCache } from './cache'

export async function insertManyBudgets(
  data: (typeof BudgetTable.$inferInsert)[],
) {
  const budgets = await db
    .insert(BudgetTable)
    .values(data)
    .onConflictDoUpdate({
      target: [BudgetTable.id],
      set: {
        amount: sql.raw(`excluded.${BudgetTable.amount.name}`),
        updatedAt: sql.raw('now()'),
      },
    })
    .returning()
  if (data.length !== 0 && budgets.length == 0)
    throw new Error('Error creating new budget')
  revalidateBudgetCache()
  return budgets
}
