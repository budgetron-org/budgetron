import {
  addDays,
  addMonths,
  addQuarters,
  addWeeks,
  format,
  isBefore,
  startOfMonth,
  startOfYear,
  subMonths,
} from 'date-fns'

import type {
  CashFlowReportData,
  CashFlowReportGranularity,
  CashFlowReportRange,
  MonthlySummary,
} from './types'

function fillMissingMonthsSummary(raw: MonthlySummary[], from: Date, to: Date) {
  const filled: MonthlySummary[] = []

  const current = new Date(from.getFullYear(), from.getMonth(), 1)
  const end = new Date(to.getFullYear(), to.getMonth(), 1)

  const lookup = new Map(raw.map((r) => [`${r.year}-${r.month}`, r]))

  while (current <= end) {
    const month = current.getMonth() + 1
    const year = current.getFullYear()
    const key = `${year}-${month}`

    const existing = lookup.get(key)

    filled.push(existing ?? { year, month, income: 0, expense: 0 })

    current.setMonth(current.getMonth() + 1)
  }

  return filled
}

function getNextDate(date: Date, granularity: CashFlowReportGranularity): Date {
  switch (granularity) {
    case 'day':
      return addDays(date, 1)
    case 'week':
      return addWeeks(date, 1)
    case 'month':
      return addMonths(date, 1)
    case 'quarter':
      return addQuarters(date, 1)
    default:
      throw new Error(`Unsupported granularity: ${granularity}`)
  }
}

function formatDateForKey(
  date: Date,
  granularity: CashFlowReportGranularity,
): string {
  return format(
    date,
    {
      day: 'MMM dd',
      week: "MMM 'W'II",
      month: 'MMM yyyy',
      quarter: "'Q'q yyyy",
    }[granularity],
  )
}

function fillMissingCashFlowReportData(
  inputMap: Map<string, CashFlowReportData & { rawPeriod: Date }>,
  startDate: Date,
  endDate: Date,
  granularity: CashFlowReportGranularity,
) {
  const resultMap = new Map(inputMap.entries())

  let current = startDate
  while (
    isBefore(current, endDate) ||
    current.getTime() === endDate.getTime()
  ) {
    const key = formatDateForKey(current, granularity)

    if (!resultMap.has(key)) {
      resultMap.set(key, {
        period: key,
        rawPeriod: current,
        income: 0,
        expenses: 0,
        transfers: 0,
        surplus: 0,
      })
    }

    current = getNextDate(current, granularity)
  }

  return resultMap
}

function getRangeMeta(range: CashFlowReportRange) {
  const now = new Date()

  switch (range) {
    case 'this_month':
      return {
        startDate: startOfMonth(now),
        endDate: now,
        granularity: 'day' as const,
      }
    case 'last_3_months':
      return {
        startDate: subMonths(startOfMonth(now), 2), // current month is included in the range
        endDate: now,
        granularity: 'week' as const,
      }
    case 'ytd':
      return {
        startDate: startOfYear(now),
        endDate: now,
        granularity: 'month' as const,
      }
    case '1_year':
      return {
        startDate: subMonths(startOfMonth(now), 11), // current month is included in the range
        endDate: now,
        granularity: 'month' as const,
      }
    case 'all':
      return {
        startDate: undefined,
        endDate: now,
        granularity: 'quarter' as const,
      }
  }
}

export {
  fillMissingCashFlowReportData,
  fillMissingMonthsSummary,
  formatDateForKey,
  getRangeMeta,
}
