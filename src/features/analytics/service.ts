import { sql } from 'drizzle-orm'

import { db } from '~/server/db'
import {
  CategoryTable,
  TransactionTable,
  type TransactionType,
} from '~/server/db/schema'
import type { CategoryReport, MonthlySummary } from './types'

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
    // JS months are 0-based (Jan = 0), while SQL months are 1-based (Jan = 1)
    // So we need to subtract 1 from the month value in the SQL query
    // to get the correct month number in the result.
    sql<MonthlySummary>`
      SELECT
        (EXTRACT(MONTH FROM ${TransactionTable.date})::int - 1) AS month,
        EXTRACT(YEAR FROM ${TransactionTable.date})::int AS year,
        SUM(CASE WHEN ${TransactionTable.type} = 'INCOME' THEN ${TransactionTable.amount} ELSE 0 END) AS income,
        SUM(CASE WHEN ${TransactionTable.type} = 'EXPENSE' THEN ${TransactionTable.amount} ELSE 0 END) AS expense
      FROM ${TransactionTable}
      WHERE ${TransactionTable.userId} = ${userId}
        AND ${TransactionTable.date} BETWEEN ${from} AND ${to}
      GROUP BY year, month
      ORDER BY year, month
    `,
  )

  return result.rows
}

type GetCategoryReportFilters = {
  userId: string
  from: Date
  to: Date
  limit: number
  type: TransactionType
}
async function getCategoryReport({
  from,
  to,
  userId,
  limit,
  type,
}: GetCategoryReportFilters) {
  const result = await db.execute<CategoryReport>(
    sql<CategoryReport>`
      SELECT
        c.id AS "categoryId",
        c.name AS "categoryName",
        c.icon AS "categoryIcon",
        p.id AS "parentCategoryId",
        p.name AS "parentCategoryName",
        p.icon AS "parentCategoryIcon",
        p.type AS "categoryType",
        SUM(t.amount) AS "total"
      FROM ${TransactionTable} t
      JOIN ${CategoryTable} c ON t.category_id = c.id
      LEFT JOIN ${CategoryTable} p ON c.parent_id = p.id
      WHERE t.user_id = ${userId}
        AND t.type = ${type}
        AND t.date BETWEEN ${from} AND ${to}
      GROUP BY c.id, c.name, c.icon, p.id, p.name, p.icon
      ORDER BY total DESC
      LIMIT ${limit}
    `,
  )

  return result.rows
}

export { getCategoryReport, getMonthlySummary }
