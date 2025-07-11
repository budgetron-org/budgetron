import type z from 'zod/v4'

import type { TransactionTypeEnum } from '~/server/db/schema'
import type { CashFlowReportRangeSchema } from './validators'

type CategoryReport = {
  categoryId: string
  categoryName: string
  categoryIcon: string
  categoryType: (typeof TransactionTypeEnum.enumValues)[number]
  parentCategoryId: string | null
  parentCategoryName: string | null
  parentCategoryIcon: string | null
  total: Intl.StringNumericLiteral
}

type CashFlowReportRange = z.infer<typeof CashFlowReportRangeSchema>

type CashFlowReportGranularity = 'day' | 'week' | 'month' | 'quarter'

type CashFlowReportData = {
  period: string
  income: number
  expenses: number
  transfers: number
  surplus: number
}

type CashFlowReport = {
  summary: {
    income: number
    expense: number
    transfer: number
    surplus: number

    monthlyAverageIncome: number
    monthlyAverageExpense: number
    monthlyAverageSurplus: number
  }
  data: CashFlowReportData[]
  meta: {
    range: CashFlowReportRange
    startDate: Date
    endDate: Date
    granularity: CashFlowReportGranularity
  }
}

type CashFlowType = 'INCOME' | 'EXPENSE' | 'SAVINGS' | 'INVESTMENT'
type OverviewSummary = {
  [key in CashFlowType]: {
    ytd: Intl.StringNumericLiteral
    thisMonth: Intl.StringNumericLiteral
    lastMonth: Intl.StringNumericLiteral
    sixMonthAvg: Intl.StringNumericLiteral
  }
}

export type {
  CashFlowReport,
  CashFlowReportData,
  CashFlowReportGranularity,
  CashFlowReportRange,
  CashFlowType,
  CategoryReport,
  OverviewSummary,
}
