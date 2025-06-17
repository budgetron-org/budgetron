import { and, between, desc, eq, inArray, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

import { startOfMonth, startOfToday, subMonths } from 'date-fns'
import { db } from '~/server/db'
import {
  BudgetTable,
  CategoryTable,
  TransactionTable,
} from '~/server/db/schema'
import type { BudgetDetails, BudgetSummary } from './types'
import { fillMissingMonthlyAverages } from './utils'

type GetBudgetsSummaryFilters = {
  userId: string
  budgetIds?: string[]
}
async function getBudgetsSummary({
  userId,
  budgetIds,
}: GetBudgetsSummaryFilters): Promise<BudgetSummary[]> {
  const ParentCategoryTable = alias(CategoryTable, 'parent')
  const budgets = (await db
    .select({
      id: BudgetTable.id,
      amount: BudgetTable.amount,

      createdAt: BudgetTable.createdAt,
      updatedAt: BudgetTable.updatedAt,

      categoryId: CategoryTable.id,
      categoryName: CategoryTable.name,
      categoryIcon: CategoryTable.icon,

      parentCategoryId: ParentCategoryTable.id,
      parentCategoryName: ParentCategoryTable.name,
      parentCategoryIcon: ParentCategoryTable.icon,

      // Parsed fields
      amountFloat: sql<number>`COALESCE(${BudgetTable.amount}, 0)::float`,

      // 1 Year Average
      oneYearAverage: sql<number>`
        COALESCE((
          SELECT AVG(month_amount)::float
          FROM (
            SELECT SUM(t.amount) AS month_amount
            FROM ${TransactionTable} t
            WHERE t.category_id = ${CategoryTable.id}
              AND t.type = 'EXPENSE'
              AND t.date >= CURRENT_DATE - INTERVAL '1 year'
            GROUP BY DATE_TRUNC('month', t.date)
          ) sub
        ), 0)
      `,

      // Last 3-Month Average
      last3MonthAverage: sql<number>`
        COALESCE((
          SELECT AVG(month_amount)::float
          FROM (
            SELECT SUM(t.amount) AS month_amount
            FROM ${TransactionTable} t
            WHERE t.category_id = ${CategoryTable.id}
              AND t.type = 'EXPENSE'
              AND t.date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3 months'
            GROUP BY DATE_TRUNC('month', t.date)
          ) sub
        ), 0)
      `,

      // Year to Date Spend
      ytdSpend: sql<number>`
        COALESCE((
          SELECT SUM(t.amount)::float
          FROM ${TransactionTable} t
          WHERE t.category_id = ${CategoryTable.id}
            AND t.type = 'EXPENSE'
            AND t.date >= DATE_TRUNC('year', CURRENT_DATE)
        ), 0)
      `,

      // Last Month Spend
      lastMonthSpend: sql<number>`
        COALESCE((
          SELECT SUM(t.amount)::float
          FROM ${TransactionTable} t
          WHERE t.category_id = ${CategoryTable.id}
            AND t.type = 'EXPENSE'
            AND DATE_TRUNC('month', t.date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
        ), 0)
      `,

      // This Month Spend
      thisMonthSpend: sql<number>`
        COALESCE((
          SELECT SUM(t.amount)::float
          FROM ${TransactionTable} t
          WHERE t.category_id = ${CategoryTable.id}
            AND t.type = 'EXPENSE'
            AND DATE_TRUNC('month', t.date) = DATE_TRUNC('month', CURRENT_DATE)
        ), 0)
      `,

      projectedSpend: sql<number>`
        COALESCE((
          SELECT
            (SUM(t.amount) / GREATEST(EXTRACT(DAY FROM CURRENT_DATE)::float, 1)) 
            * EXTRACT(DAY FROM DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')
          FROM ${TransactionTable} t
          WHERE t.category_id = ${CategoryTable.id}
            AND t.type = 'EXPENSE'
            AND DATE_TRUNC('month', t.date) = DATE_TRUNC('month', CURRENT_DATE)
        ), 0)
      `,
    })
    .from(BudgetTable)
    .innerJoin(CategoryTable, eq(BudgetTable.categoryId, CategoryTable.id))
    .leftJoin(
      ParentCategoryTable,
      eq(CategoryTable.parentId, ParentCategoryTable.id),
    )
    .where(
      budgetIds == null
        ? eq(BudgetTable.userId, userId)
        : and(
            eq(BudgetTable.userId, userId),
            inArray(BudgetTable.id, budgetIds),
          ),
    )
    .orderBy(desc(BudgetTable.createdAt))) satisfies BudgetSummary[]

  return budgets
}

type GetBudgetDetailsFilters = {
  id: string
  userId: string
}
async function getBudgetDetails({
  id,
  userId,
}: GetBudgetDetailsFilters): Promise<BudgetDetails> {
  // first get the budget summary
  const [budgetSummary] = await getBudgetsSummary({ userId, budgetIds: [id] })
  if (budgetSummary == null) throw new Error('Budget not found')

  const today = startOfToday()
  const oneYearAgo = subMonths(startOfMonth(today), 12)

  // get the 1 year rolling monthly averages for chart
  const rawMonthlyAverages = await db
    .select({
      month: sql<string>`TO_CHAR(DATE_TRUNC('month', ${TransactionTable.date}), 'YYYY-MM')`,
      average: sql<number>`SUM(${TransactionTable.amount})::float`,
    })
    .from(TransactionTable)
    .where(
      and(
        eq(TransactionTable.userId, userId),
        eq(TransactionTable.categoryId, budgetSummary.categoryId),
        eq(TransactionTable.type, 'EXPENSE'),
        between(TransactionTable.date, oneYearAgo, today),
      ),
    )
    .groupBy(sql<string>`DATE_TRUNC('month', ${TransactionTable.date})`)
    .orderBy(desc(sql<string>`DATE_TRUNC('month', ${TransactionTable.date})`))
  const monthlyAverages = fillMissingMonthlyAverages(
    rawMonthlyAverages,
    oneYearAgo,
    today,
  )

  // get the 1 year rolling transactions (with all the relations)
  const transactions = await db.query.TransactionTable.findMany({
    where: and(
      eq(TransactionTable.userId, userId),
      eq(TransactionTable.categoryId, budgetSummary.categoryId),
      eq(TransactionTable.type, 'EXPENSE'),
      between(TransactionTable.date, oneYearAgo, today),
    ),
    with: {
      bankAccount: true,
      fromBankAccount: true,
      toBankAccount: true,
      category: { with: { parent: true } },
      group: true,
    },
    extras: {
      cashFlow: sql<'IN' | 'OUT'>`
        CASE
          WHEN ${TransactionTable.type} = 'INCOME' THEN 'IN'
          WHEN ${TransactionTable.type} = 'EXPENSE' AND ${TransactionTable.amount} > 0 THEN 'OUT'
          WHEN ${TransactionTable.type} = 'EXPENSE' AND ${TransactionTable.amount} < 0 THEN 'IN'
          WHEN ${TransactionTable.type} = 'TRANSFER' AND ${TransactionTable.bankAccountId} = ${TransactionTable.toBankAccountId} THEN 'IN'
          WHEN ${TransactionTable.type} = 'TRANSFER' AND ${TransactionTable.bankAccountId} = ${TransactionTable.fromBankAccountId} THEN 'OUT'
          ELSE 'OUT'
        END
      `.as('cash_flow'),
    },
    orderBy: (t) => [desc(t.date)],
  })
  return {
    budgetSummary,
    monthlyAverages,
    transactions,
  } satisfies BudgetDetails
}

async function insertBudget(data: typeof BudgetTable.$inferInsert) {
  const [budget] = await db.insert(BudgetTable).values(data).returning()
  if (budget == null) throw new Error('Error creating new budget')
  return budget
}

async function updateBudget(
  data: Required<
    Pick<
      typeof BudgetTable.$inferInsert,
      'amount' | 'categoryId' | 'id' | 'userId'
    >
  >,
) {
  const [budget] = await db
    .update(BudgetTable)
    .set({
      amount: data.amount,
      categoryId: data.categoryId,
    })
    .where(
      and(eq(BudgetTable.id, data.id), eq(BudgetTable.userId, data.userId)),
    )
    .returning()
  if (budget == null) throw new Error('Error updating budget')
  return budget
}

async function deleteBudget(
  data: Pick<typeof BudgetTable.$inferSelect, 'id' | 'userId'>,
) {
  const [deleted] = await db
    .delete(BudgetTable)
    .where(
      and(eq(BudgetTable.id, data.id), eq(BudgetTable.userId, data.userId)),
    )
    .returning()
  if (deleted == null) throw new Error('Error deleting budget')
  return deleted
}

export {
  deleteBudget,
  getBudgetDetails,
  getBudgetsSummary,
  insertBudget,
  updateBudget,
}
