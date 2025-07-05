import { addMonths, differenceInMonths, endOfToday, subMonths } from 'date-fns'
import { and, between, desc, eq, gte, lte, sql, sum } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

import { db } from '~/server/db'
import {
  BankAccountTable,
  CategoryTable,
  TransactionTable,
  type TransactionType,
} from '~/server/db/schema'
import type {
  CashFlowReport,
  CashFlowReportData,
  CashFlowReportRange,
  CashFlowType,
  CategoryReport,
  OverviewSummary,
} from './types'
import {
  fillMissingCashFlowReportData,
  formatDateForKey,
  getRangeMeta,
} from './utils'

type GetOverviewSummaryFilters = {
  userId: string
}
async function getOverviewSummary({ userId }: GetOverviewSummaryFilters) {
  const ToBankAccountTable = alias(BankAccountTable, 'toBankAccount')
  // write an SQL query to get the OverviewSummary
  const result = await db
    .select({
      cashFlowType: sql<CashFlowType>`case
          when ${TransactionTable.type} = 'INCOME' then 'INCOME'
          when ${TransactionTable.type} = 'EXPENSE' then 'EXPENSE'
          when ${TransactionTable.type} = 'TRANSFER' and ${ToBankAccountTable.type} = 'SAVINGS' then 'SAVINGS'
          when ${TransactionTable.type} = 'TRANSFER' and ${ToBankAccountTable.type} = 'INVESTMENT' then 'INVESTMENT'
          else null
        end`.as('cash_flow_type'),

      ytd: sql<number>`
        sum(case when ${TransactionTable.date} >= date_trunc('year', current_date)
                 then ${TransactionTable.amount} else 0 end)
      `.as('ytd'),

      thisMonth: sql<number>`
        sum(case when ${TransactionTable.date} >= date_trunc('month', current_date)
                 then ${TransactionTable.amount} else 0 end)
      `.as('this_month'),

      lastMonth: sql<number>`
        sum(case
          when ${TransactionTable.date} >= date_trunc('month', current_date - interval '1 month')
           and ${TransactionTable.date} < date_trunc('month', current_date)
          then ${TransactionTable.amount}
          else 0
        end)
      `.as('last_month'),

      sixMonthAvg: sql<number>`
        sum(${TransactionTable.amount}) / 6.0
      `.as('six_month_avg'),
    })
    .from(TransactionTable)
    .leftJoin(
      ToBankAccountTable,
      eq(TransactionTable.toBankAccountId, ToBankAccountTable.id),
    )
    .where(
      and(
        eq(TransactionTable.userId, userId),
        gte(TransactionTable.date, subMonths(endOfToday(), 6)),
      ),
    )
    .groupBy(sql<CashFlowType>`cash_flow_type`)

  return result.reduce((acc, curr) => {
    // ignore null cash flow types
    if (curr.cashFlowType === null) return acc
    acc[curr.cashFlowType] = {
      ytd: curr.ytd,
      thisMonth: curr.thisMonth,
      lastMonth: curr.lastMonth,
      sixMonthAvg: curr.sixMonthAvg,
    }
    return acc
  }, {} as OverviewSummary)
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

export { getCashFlowReport, getCategoryReport, getOverviewSummary }
