import { addMonths, differenceInMonths } from 'date-fns'
import { and, between, desc, eq, lte, sql, sum } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

import { safeParseNumber } from '~/lib/utils'
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
  const result = (await db
    .select({
      month: sql<string>`TO_CHAR(DATE_TRUNC('month', ${TransactionTable.date}), 'YYYY-MM')`,
      income: sum(
        sql<number>`CASE WHEN ${TransactionTable.type} = 'INCOME' THEN ${TransactionTable.amount} ELSE 0 END`,
      ).mapWith(safeParseNumber),
      expense: sum(
        sql<number>`CASE WHEN ${TransactionTable.type} = 'EXPENSE' THEN ${TransactionTable.amount} ELSE 0 END`,
      ).mapWith(safeParseNumber),
    })
    .from(TransactionTable)
    .where(
      and(
        eq(TransactionTable.userId, userId),
        between(TransactionTable.date, from, to),
      ),
    )
    .groupBy(sql<string>`DATE_TRUNC('month', ${TransactionTable.date})`)
    .orderBy(
      sql<string>`DATE_TRUNC('month', ${TransactionTable.date})`,
    )) satisfies MonthlySummary[]

  return result
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
  const ParentCategoryTable = alias(CategoryTable, 'parent')
  const result = (await db
    .select({
      categoryId: CategoryTable.id,
      categoryName: CategoryTable.name,
      categoryIcon: CategoryTable.icon,
      categoryType: CategoryTable.type,
      parentCategoryId: CategoryTable.parentId,
      parentCategoryName: ParentCategoryTable.name,
      parentCategoryIcon: ParentCategoryTable.icon,
      parentCategoryType: ParentCategoryTable.type,
      total: sum(TransactionTable.amount).mapWith(String),
    })
    .from(TransactionTable)
    .innerJoin(CategoryTable, eq(TransactionTable.categoryId, CategoryTable.id))
    .leftJoin(
      ParentCategoryTable,
      eq(CategoryTable.parentId, ParentCategoryTable.id),
    )
    .where(
      and(
        eq(TransactionTable.userId, userId),
        eq(TransactionTable.type, type),
        between(TransactionTable.date, from, to),
      ),
    )
    .groupBy(
      CategoryTable.id,
      CategoryTable.name,
      CategoryTable.icon,
      ParentCategoryTable.id,
      ParentCategoryTable.name,
      ParentCategoryTable.icon,
    )
    .orderBy(desc(sum(TransactionTable.amount)))
    .limit(limit)) satisfies CategoryReport[]

  return result
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
