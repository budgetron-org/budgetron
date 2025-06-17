import type z from 'zod/v4'

import type { TransactionType } from '~/server/db/enums'
import type { CashFlowReportRangeSchema } from './validators'

type CategoryReport = {
  categoryId: string
  categoryName: string
  categoryIcon: string
  categoryType: TransactionType
  parentCategoryId: string | null
  parentCategoryName: string | null
  parentCategoryIcon: string | null
  total: string
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

type MonthlySummary = {
  month: string
  income: number
  expense: number
}

export type {
  CashFlowReport,
  CashFlowReportData,
  CashFlowReportGranularity,
  CashFlowReportRange,
  CategoryReport,
  MonthlySummary,
}
