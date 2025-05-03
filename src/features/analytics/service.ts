import { sql } from 'drizzle-orm'

import { db } from '~/server/db'
import { CategoryTable, TransactionTable } from '~/server/db/schema'
import type { CategorySpend, MonthlySummary } from './types'

type GetMonthlySummaryFilters = {
  userId: string
  from: Date
  to: Date
}
async function getMonthlySummary({
  from,
  to,
  userId,
}: GetMonthlySummaryFilters) {
  const result = await db.execute<MonthlySummary>(
    sql<MonthlySummary>`
      SELECT
        EXTRACT(MONTH FROM ${TransactionTable.date})::int AS month,
        EXTRACT(YEAR FROM ${TransactionTable.date})::int AS year,
        SUM(CASE WHEN ${TransactionTable.type} = 'income' THEN ${TransactionTable.amount} ELSE 0 END) AS income,
        SUM(CASE WHEN ${TransactionTable.type} = 'expense' THEN ${TransactionTable.amount} ELSE 0 END) AS expense
      FROM ${TransactionTable}
      WHERE ${TransactionTable.userId} = ${userId}
        AND ${TransactionTable.date} BETWEEN ${from} AND ${to}
      GROUP BY year, month
      ORDER BY year, month
    `,
  )

  return result.rows
}

type GetCategorySpendFilters = {
  userId: string
  from: Date
  to: Date
  limit: number
}
async function getCategorySpend({
  from,
  to,
  userId,
  limit,
}: GetCategorySpendFilters) {
  const result = await db.execute<CategorySpend>(
    sql<CategorySpend>`
      SELECT
        c.id AS "categoryId",
        c.name AS "categoryName",
        c.icon AS "categoryIcon",
        p.id AS "parentCategoryId",
        p.name AS "parentCategoryName",
        p.icon AS "parentCategoryIcon",
        SUM(t.amount) AS "total"
      FROM ${TransactionTable} t
      JOIN ${CategoryTable} c ON t.category_id = c.id
      LEFT JOIN ${CategoryTable} p ON c.parent_id = p.id
      WHERE t.user_id = ${userId}
        AND t.type = 'expense'
        AND t.date BETWEEN ${from} AND ${to}
      GROUP BY c.id, c.name, c.icon, p.id, p.name, p.icon
      ORDER BY total DESC
      LIMIT ${limit}
    `,
  )

  return result.rows
}

export { getCategorySpend, getMonthlySummary }
