import type { TransactionType } from '~/server/db/enums'

type CategoryReport = {
  categoryId: string
  categoryName: string
  categoryIcon: string
  categoryType: TransactionType
  parentCategoryId: string
  parentCategoryName: string
  parentCategoryIcon: string
  total: string
}

type MonthlySummary = {
  month: number
  year: number
  income: number
  expense: number
}

export type { CategoryReport, MonthlySummary }
