import { and, between, desc, eq, inArray, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

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

      // 1 Year Monthly Average
      oneYearAverage: sql<Intl.StringNumericLiteral>`
        SELECT AVG(month_amount)
        FROM (
          SELECT SUM(t.amount) AS month_amount
          FROM ${TransactionTable} t
          WHERE t.category_id = ${CategoryTable.id}
            AND t.type = 'EXPENSE'
            AND t.date >= CURRENT_DATE - INTERVAL '1 year'
          GROUP BY DATE_TRUNC('month', t.date)
        ) sub
      `,

      // Last 3-Month Monthly Average
      last3MonthAverage: sql<Intl.StringNumericLiteral>`
        SELECT AVG(month_amount)
        FROM (
          SELECT SUM(t.amount) AS month_amount
            FROM ${TransactionTable} t
            WHERE t.category_id = ${CategoryTable.id}
              AND t.type = 'EXPENSE'
              AND t.date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3 months'
            GROUP BY DATE_TRUNC('month', t.date)
          ) sub
      `,

      // Year to Date Spend
      ytdSpend: sql<Intl.StringNumericLiteral>`
        SELECT SUM(t.amount)
        FROM ${TransactionTable} t
        WHERE t.category_id = ${CategoryTable.id}
          AND t.type = 'EXPENSE'
          AND t.date >= DATE_TRUNC('year', CURRENT_DATE)
      `,

      // Last Month Spend
      lastMonthSpend: sql<Intl.StringNumericLiteral>`
        SELECT SUM(t.amount)
        FROM ${TransactionTable} t
        WHERE t.category_id = ${CategoryTable.id}
          AND t.type = 'EXPENSE'
          AND DATE_TRUNC('month', t.date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      `,

      // This Month Spend
      thisMonthSpend: sql<Intl.StringNumericLiteral>`
        SELECT SUM(t.amount)
        FROM ${TransactionTable} t
        WHERE t.category_id = ${CategoryTable.id}
          AND t.type = 'EXPENSE'
          AND DATE_TRUNC('month', t.date) = DATE_TRUNC('month', CURRENT_DATE)
      `,

      projectedSpend: sql<Intl.StringNumericLiteral>`
        SELECT
          (SUM(t.amount) / GREATEST(EXTRACT(DAY FROM CURRENT_DATE), 1)) 
          * EXTRACT(DAY FROM DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')
        FROM ${TransactionTable} t
        WHERE t.category_id = ${CategoryTable.id}
          AND t.type = 'EXPENSE'
          AND DATE_TRUNC('month', t.date) = DATE_TRUNC('month', CURRENT_DATE)
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
  fromDate: Date
  toDate: Date
}
async function getBudgetDetails({
  id,
  userId,
  fromDate,
  toDate,
}: GetBudgetDetailsFilters): Promise<BudgetDetails> {
  const [budgetSummary] = await getBudgetsSummary({ userId, budgetIds: [id] })
  if (budgetSummary == null) throw new Error('Budget not found')

  const rawMonthlyAverages = await db
    .select({
      month: sql<string>`TO_CHAR(DATE_TRUNC('month', ${TransactionTable.date}), 'YYYY-MM')`,
      average: sql<Intl.StringNumericLiteral>`SUM(${TransactionTable.amount})`,
    })
    .from(TransactionTable)
    .where(
      and(
        eq(TransactionTable.userId, userId),
        eq(TransactionTable.categoryId, budgetSummary.categoryId),
        eq(TransactionTable.type, 'EXPENSE'),
        between(TransactionTable.date, fromDate, toDate),
      ),
    )
    .groupBy(sql<string>`DATE_TRUNC('month', ${TransactionTable.date})`)
    .orderBy(desc(sql<string>`DATE_TRUNC('month', ${TransactionTable.date})`))
  const monthlyAverages = fillMissingMonthlyAverages(
    rawMonthlyAverages,
    fromDate,
    toDate,
  )

  return {
    budgetSummary,
    monthlyAverages,
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
