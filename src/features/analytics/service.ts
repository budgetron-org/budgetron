import { addMonths, differenceInMonths } from 'date-fns'
import { and, between, desc, eq, lte, sql, sum } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

import type { CurrencyCode } from '~/data/currencies'
import { getCurrencyExchangeRateForUser } from '~/lib/currency-exchange'
import { add, div, mul, sub } from '~/lib/currency-operations'
import { db } from '~/server/db'
import {
  BankAccountTable,
  CategoryTable,
  TransactionTable,
  type TransactionTypeEnum,
} from '~/server/db/schema'
import type {
  CashFlowReport,
  CashFlowReportData,
  CashFlowReportRange,
  CashFlowType,
  CategoryReport,
  CategoryReportData,
  OverviewSummary,
  OverviewSummaryData,
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
  const result = await db.execute<{
    cash_flow_type: CashFlowType
    currency: CurrencyCode
    ytd: Intl.StringNumericLiteral
    this_month: Intl.StringNumericLiteral
    last_month: Intl.StringNumericLiteral
    six_month_avg: Intl.StringNumericLiteral
  }>(sql`
    WITH transactions_with_cash_flow AS (
      SELECT
        t.*,
        CASE
          WHEN t.type = 'INCOME' THEN 'INCOME'
          WHEN t.type = 'EXPENSE' THEN 'EXPENSE'
          WHEN t.type = 'TRANSFER' AND b_to.type = 'SAVINGS' THEN 'SAVINGS'
          WHEN t.type = 'TRANSFER' AND b_to.type = 'INVESTMENT' THEN 'INVESTMENT'
          ELSE NULL
        END AS cash_flow_type
      FROM ${TransactionTable} t
      LEFT JOIN ${BankAccountTable} b_to ON t.to_bank_account_id = b_to.id
      WHERE t.user_id = ${userId}
        AND t.date >= DATE_TRUNC('day', CURRENT_DATE) - INTERVAL '1 year'
    )

    SELECT
      t.cash_flow_type,
      t.currency,

      SUM(CASE WHEN t.date >= DATE_TRUNC('year', CURRENT_DATE) THEN t.amount ELSE 0 END) AS ytd,
      SUM(CASE WHEN t.date >= DATE_TRUNC('month', CURRENT_DATE) THEN t.amount ELSE 0 END) AS this_month,
      SUM(CASE
            WHEN t.date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
              AND t.date < DATE_TRUNC('month', CURRENT_DATE)
            THEN t.amount
            ELSE 0
          END) AS last_month,

      six_month_aggregate.avg AS six_month_avg

    FROM transactions_with_cash_flow t

    LEFT JOIN LATERAL (
      WITH
        last_six_months AS (
          SELECT DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' * i AS month
          FROM generate_series(0, 5) AS s(i)
        ),
        monthly_totals AS (
          SELECT
            DATE_TRUNC('month', t2.date) AS month,
            SUM(t2.amount) AS total
          FROM transactions_with_cash_flow t2
          WHERE t2.user_id = t.user_id
            AND t2.currency = t.currency
            AND t2.cash_flow_type = t.cash_flow_type
            AND t2.date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '6 months'
          GROUP BY DATE_TRUNC('month', t2.date)
        ),
        filled_months AS (
          SELECT
            m.month,
            COALESCE(mt.total, 0) AS monthly_total
          FROM last_six_months m
          LEFT JOIN monthly_totals mt ON mt.month = m.month
        )
    
      SELECT AVG(monthly_total) AS avg
      FROM filled_months
    ) six_month_aggregate ON true

    GROUP BY t.cash_flow_type, t.currency, six_month_aggregate.avg
  `)
  // get Base Currency from user settings and conversion rate
  const { baseCurrency, exchangeRates, currencyExchangeAttribution } =
    await getCurrencyExchangeRateForUser(userId)
  const convertedCurrencies = new Set<CurrencyCode>()

  const data = result.rows.reduce((acc, item) => {
    // Do not include unsupported currencies. Ideally we will never get here.
    if (!exchangeRates.has(item.currency)) {
      return acc
    }
    // add currency to convertedCurrencies if it is not the base currency
    if (item.currency !== baseCurrency) {
      convertedCurrencies.add(item.currency)
    }

    // convert if not in base currency
    const ytd =
      item.currency === baseCurrency
        ? item.ytd
        : mul(item.ytd, exchangeRates.get(item.currency)!.rate)
    const thisMonth =
      item.currency === baseCurrency
        ? item.this_month
        : mul(item.this_month, exchangeRates.get(item.currency)!.rate)
    const lastMonth =
      item.currency === baseCurrency
        ? item.last_month
        : mul(item.last_month, exchangeRates.get(item.currency)!.rate)
    const sixMonthAvg =
      item.currency === baseCurrency
        ? item.six_month_avg
        : mul(item.six_month_avg, exchangeRates.get(item.currency)!.rate)

    // create a new record if there is none for this cash flow type
    if (!(item.cash_flow_type in acc)) {
      acc[item.cash_flow_type] = {
        ytd: {
          baseCurrency: '0' as Intl.StringNumericLiteral,
          byCurrency: [],
        },
        thisMonth: {
          baseCurrency: '0' as Intl.StringNumericLiteral,
          byCurrency: [],
        },
        lastMonth: {
          baseCurrency: '0' as Intl.StringNumericLiteral,
          byCurrency: [],
        },
        sixMonthAvg: {
          baseCurrency: '0' as Intl.StringNumericLiteral,
          byCurrency: [],
        },
      }
    }

    // Add current amount to the baseCurrency
    acc[item.cash_flow_type].ytd.baseCurrency = add(
      acc[item.cash_flow_type].ytd.baseCurrency,
      ytd,
    )
    acc[item.cash_flow_type].thisMonth.baseCurrency = add(
      acc[item.cash_flow_type].thisMonth.baseCurrency,
      thisMonth,
    )
    acc[item.cash_flow_type].lastMonth.baseCurrency = add(
      acc[item.cash_flow_type].lastMonth.baseCurrency,
      lastMonth,
    )
    acc[item.cash_flow_type].sixMonthAvg.baseCurrency = add(
      acc[item.cash_flow_type].sixMonthAvg.baseCurrency,
      sixMonthAvg,
    )

    // Add current amount to the byCurrency map
    acc[item.cash_flow_type].ytd.byCurrency.push({
      currency: item.currency,
      amount: item.ytd,
    })
    acc[item.cash_flow_type].thisMonth.byCurrency.push({
      currency: item.currency,
      amount: item.this_month,
    })
    acc[item.cash_flow_type].lastMonth.byCurrency.push({
      currency: item.currency,
      amount: item.last_month,
    })
    acc[item.cash_flow_type].sixMonthAvg.byCurrency.push({
      currency: item.currency,
      amount: item.six_month_avg,
    })
    return acc
  }, {} as OverviewSummaryData)

  // fill in missing records
  for (const type of [
    'INCOME',
    'EXPENSE',
    'SAVINGS',
    'INVESTMENT',
  ] as CashFlowType[]) {
    if (type in data) continue
    data[type] = {
      lastMonth: {
        baseCurrency: '0',
        byCurrency: [],
      },
      sixMonthAvg: {
        baseCurrency: '0',
        byCurrency: [],
      },
      thisMonth: {
        baseCurrency: '0',
        byCurrency: [],
      },
      ytd: {
        baseCurrency: '0',
        byCurrency: [],
      },
    }
  }

  return {
    baseCurrency,
    convertedCurrencies: Array.from(convertedCurrencies),
    currencyExchangeAttribution,
    data,
  } satisfies OverviewSummary
}

type GetCategoryReportFilters = {
  userId: string
  from: Date
  to: Date
  limit: number
  type: (typeof TransactionTypeEnum.enumValues)[number]
}
async function getCategoryReport({
  from,
  to,
  userId,
  limit,
  type,
}: GetCategoryReportFilters) {
  const ParentCategoryTable = alias(CategoryTable, 'parent')
  const result = await db
    .select({
      categoryId: CategoryTable.id,
      categoryName: CategoryTable.name,
      categoryIcon: CategoryTable.icon,
      categoryType: CategoryTable.type,
      parentCategoryId: CategoryTable.parentId,
      parentCategoryName: ParentCategoryTable.name,
      parentCategoryIcon: ParentCategoryTable.icon,
      parentCategoryType: ParentCategoryTable.type,
      currency: TransactionTable.currency,
      total: sql<Intl.StringNumericLiteral>`sum(${TransactionTable.amount})`,
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
      TransactionTable.currency,
    )
    .orderBy(desc(sum(TransactionTable.amount)))
    .limit(limit)
  const { baseCurrency, exchangeRates, currencyExchangeAttribution } =
    await getCurrencyExchangeRateForUser(userId)

  const mapByCategory = new Map<string, CategoryReportData>()
  const convertedCurrencies = new Set<CurrencyCode>()
  for (const item of result) {
    // add currency to convertedCurrencies if it is not the base currency
    if (item.currency !== baseCurrency) {
      convertedCurrencies.add(item.currency)
    }

    const itemTotalInBaseCurrency =
      item.currency === baseCurrency
        ? item.total
        : mul(item.total, exchangeRates.get(item.currency)!.rate)

    if (!mapByCategory.has(item.categoryId)) {
      mapByCategory.set(item.categoryId, {
        ...item,
        total: {
          baseCurrency: itemTotalInBaseCurrency,
          byCurrency: [
            {
              currency: item.currency,
              amount: item.total,
              convertedAmount: itemTotalInBaseCurrency,
            },
          ],
        },
      })
      continue
    }

    const categoryData = mapByCategory.get(item.categoryId)!
    categoryData.total.baseCurrency = add(
      categoryData.total.baseCurrency,
      itemTotalInBaseCurrency,
    )
    categoryData.total.byCurrency.push({
      currency: item.currency,
      amount: item.total,
      convertedAmount: itemTotalInBaseCurrency,
    })
  }

  return {
    baseCurrency,
    convertedCurrencies: Array.from(convertedCurrencies),
    currencyExchangeAttribution,
    data: Array.from(mapByCategory.values()),
  } satisfies CategoryReport
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
      currency: TransactionTable.currency,
      total: sql<Intl.StringNumericLiteral>`sum(${TransactionTable.amount})`,
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
    .groupBy(
      sql`${truncatedDate}`,
      TransactionTable.type,
      TransactionTable.currency,
    )
    .orderBy(sql`${truncatedDate}`)

  const { baseCurrency, exchangeRates, currencyExchangeAttribution } =
    await getCurrencyExchangeRateForUser(userId)

  // return empty results if there are no rows matching the query
  if (results.length === 0) {
    return {
      baseCurrency,
      convertedCurrencies: [],
      currencyExchangeAttribution,
      summary: {
        income: '0',
        expense: '0',
        transfer: '0',
        surplus: '0',
        monthlyAverageIncome: '0',
        monthlyAverageExpense: '0',
        monthlyAverageSurplus: '0',
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

  let totalIncome: Intl.StringNumericLiteral = '0'
  let totalExpenses: Intl.StringNumericLiteral = '0'
  let totalTransfers: Intl.StringNumericLiteral = '0'
  const convertedCurrencies = new Set<CurrencyCode>()

  for (const row of results) {
    // skip unsupported currencies
    if (!exchangeRates.has(row.currency)) {
      continue
    }

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
      income: '0',
      expenses: '0',
      transfers: '0',
      surplus: '0',
      convertedCurrencies: [],
    }

    // convert if not in base currency
    let total = row.total
    if (row.currency !== baseCurrency) {
      total = mul(row.total, exchangeRates.get(row.currency)!.rate)
      convertedCurrencies.add(row.currency)
      if (!entry.convertedCurrencies.includes(row.currency)) {
        entry.convertedCurrencies.push(row.currency)
      }
    }

    switch (row.type) {
      case 'INCOME': {
        entry.income = add(entry.income, total)
        totalIncome = add(totalIncome, total)
        break
      }
      case 'EXPENSE': {
        entry.expenses = add(entry.expenses, total)
        totalExpenses = add(totalExpenses, total)
        break
      }
      case 'TRANSFER': {
        entry.transfers = add(entry.transfers, total)
        totalTransfers = add(totalTransfers, total)
        break
      }
    }

    chartMap.set(dateKey, entry)
  }

  for (const entry of chartMap.values()) {
    entry.surplus = sub(entry.income, entry.expenses)
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
    baseCurrency,
    convertedCurrencies: Array.from(convertedCurrencies),
    currencyExchangeAttribution,
    summary: {
      income: totalIncome,
      expense: totalExpenses,
      transfer: totalTransfers,
      surplus: sub(totalIncome, totalExpenses),

      monthlyAverageIncome: div(totalIncome, months),
      monthlyAverageExpense: div(totalExpenses, months),
      monthlyAverageSurplus: div(sub(totalIncome, totalExpenses), months),
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
