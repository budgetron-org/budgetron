import type z from 'zod/v4'

import type { CurrencyCode } from '~/data/currencies'
import type { TransactionTypeEnum } from '~/server/db/schema'
import type { CashFlowReportRangeSchema } from './validators'

type CategoryReportData = {
  categoryId: string
  categoryName: string
  categoryIcon: string
  categoryType: (typeof TransactionTypeEnum.enumValues)[number]
  parentCategoryId: string | null
  parentCategoryName: string | null
  parentCategoryIcon: string | null
  total: {
    baseCurrency: Intl.StringNumericLiteral
    byCurrency: {
      currency: CurrencyCode
      amount: Intl.StringNumericLiteral
      convertedAmount: Intl.StringNumericLiteral
    }[]
  }
}

type CategoryReport = {
  baseCurrency: CurrencyCode
  convertedCurrencies: CurrencyCode[]
  currencyExchangeAttribution?: {
    text: string
    url: string
  }
  data: CategoryReportData[]
}

type CashFlowReportRange = z.infer<typeof CashFlowReportRangeSchema>

type CashFlowReportGranularity = 'day' | 'week' | 'month' | 'quarter'

type CashFlowReportData = {
  period: string
  income: Intl.StringNumericLiteral
  expenses: Intl.StringNumericLiteral
  transfers: Intl.StringNumericLiteral
  surplus: Intl.StringNumericLiteral
  convertedCurrencies: CurrencyCode[]
}

type CashFlowReport = {
  baseCurrency: CurrencyCode
  convertedCurrencies: CurrencyCode[]
  currencyExchangeAttribution?: {
    text: string
    url: string
  }
  summary: {
    income: Intl.StringNumericLiteral
    expense: Intl.StringNumericLiteral
    transfer: Intl.StringNumericLiteral
    surplus: Intl.StringNumericLiteral

    monthlyAverageIncome: Intl.StringNumericLiteral
    monthlyAverageExpense: Intl.StringNumericLiteral
    monthlyAverageSurplus: Intl.StringNumericLiteral
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
type OverviewSummaryData = {
  [key in CashFlowType]: {
    ytd: {
      baseCurrency: Intl.StringNumericLiteral
      byCurrency: {
        currency: CurrencyCode
        amount: Intl.StringNumericLiteral
      }[]
    }
    thisMonth: {
      baseCurrency: Intl.StringNumericLiteral
      byCurrency: {
        currency: CurrencyCode
        amount: Intl.StringNumericLiteral
      }[]
    }
    lastMonth: {
      baseCurrency: Intl.StringNumericLiteral
      byCurrency: {
        currency: CurrencyCode
        amount: Intl.StringNumericLiteral
      }[]
    }
    sixMonthAvg: {
      baseCurrency: Intl.StringNumericLiteral
      byCurrency: {
        currency: CurrencyCode
        amount: Intl.StringNumericLiteral
      }[]
    }
  }
}
type OverviewSummary = {
  baseCurrency: CurrencyCode
  convertedCurrencies: CurrencyCode[]
  currencyExchangeAttribution?: {
    text: string
    url: string
  }
  data: OverviewSummaryData
}

export type {
  CashFlowReport,
  CashFlowReportData,
  CashFlowReportGranularity,
  CashFlowReportRange,
  CashFlowType,
  CategoryReport,
  CategoryReportData,
  OverviewSummary,
  OverviewSummaryData,
}
