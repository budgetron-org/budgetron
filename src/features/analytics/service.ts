import { addMonths, differenceInMonths } from 'date-fns'
import { and, between, eq, lte, sql, sum } from 'drizzle-orm'

import { db } from '~/server/db'
import {
  CategoryTable,
  TransactionTable,
  type TransactionType,
} from '~/server/db/schema'
import type {
  CashFlowReport,
  CashFlowReportData,
  CashFlowReportRange,
  CategoryReport,
  MonthlySummary,
} from './types'
import {
  fillMissingCashFlowReportData,
  formatDateForKey,
  getRangeMeta,
} from './utils'

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
        SUM(CASE WHEN ${TransactionTable.type} = 'INCOME' THEN ${TransactionTable.amount} ELSE 0 END)::float AS income,
        SUM(CASE WHEN ${TransactionTable.type} = 'EXPENSE' THEN ${TransactionTable.amount} ELSE 0 END)::float AS expense
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

type GetCashFlowReportFilters = {
  userId: string
  range: CashFlowReportRange
}
async function getCashFlowReport({ userId, range }: GetCashFlowReportFilters) {
  const {
    startDate: startDateForQuery,
    endDate,
    granularity,
  } = getRangeMeta(range)

  const truncatedDate = sql
    .raw(`DATE_TRUNC('${granularity}', ${TransactionTable.date.name})::date`)
    .mapWith(String)

  const results = await db
    .select({
      period: truncatedDate.as('period'),
      type: TransactionTable.type,
      total: sum(TransactionTable.amount).mapWith(Number).as('total'),
    })
    .from(TransactionTable)
    .where(
      and(
        eq(TransactionTable.userId, userId),
        startDateForQuery
          ? between(TransactionTable.date, startDateForQuery, endDate)
          : lte(TransactionTable.date, endDate),
      ),
    )
    .groupBy(sql`${truncatedDate}`, TransactionTable.type)
    .orderBy(sql`${truncatedDate}`)

  // return empty results if there are no rows matching the query
  if (results.length === 0) {
    return {
      summary: {
        income: 0,
        expense: 0,
        transfer: 0,
        surplus: 0,
        monthlyAverageIncome: 0,
        monthlyAverageExpense: 0,
        monthlyAverageSurplus: 0,
      },
      data: [],
      meta: {
        range,
        startDate: startDateForQuery ?? new Date(1, 1, 1),
        endDate,
        granularity,
      },
    } satisfies CashFlowReport
  }

  const startDate = startDateForQuery ?? new Date(results[0]!.period)
  const chartMap = new Map<string, CashFlowReportData & { rawPeriod: Date }>()

  let totalIncome = 0
  let totalExpenses = 0
  let totalTransfers = 0

  for (const row of results) {
    const [year, month, day] = row.period.split('-').map(Number) as [
      number,
      number,
      number,
    ]
    const rawDate = new Date(year, month - 1, day)
    const dateKey = formatDateForKey(rawDate, granularity)

    const entry = chartMap.get(dateKey) ?? {
      period: dateKey,
      rawPeriod: rawDate,
      income: 0,
      expenses: 0,
      transfers: 0,
      surplus: 0,
    }

    switch (row.type) {
      case 'INCOME':
        entry.income += row.total
        totalIncome += row.total
        break
      case 'EXPENSE':
        entry.expenses += row.total
        totalExpenses += row.total
        break
      case 'TRANSFER':
        entry.transfers += row.total
        totalTransfers += row.total
        break
    }

    chartMap.set(dateKey, entry)
  }

  for (const entry of chartMap.values()) {
    entry.surplus = entry.income - entry.expenses
  }

  const chartData = Array.from(
    fillMissingCashFlowReportData(
      chartMap,
      startDate,
      endDate,
      granularity,
    ).values(),
  ).sort((a, b) => a.rawPeriod.getTime() - b.rawPeriod.getTime())

  // Calculate the number of months in the range for monthly averages
  const months = Math.max(
    1,
    differenceInMonths(addMonths(endDate, 1), startDate),
  )

  return {
    summary: {
      income: totalIncome,
      expense: totalExpenses,
      transfer: totalTransfers,
      surplus: totalIncome - totalExpenses,

      monthlyAverageIncome: totalIncome / months,
      monthlyAverageExpense: totalExpenses / months,
      monthlyAverageSurplus: (totalIncome - totalExpenses) / months,
    },
    data: chartData,
    meta: {
      range,
      startDate,
      endDate,
      granularity,
    },
  } satisfies CashFlowReport
}

export { getCashFlowReport, getCategoryReport, getMonthlySummary }
