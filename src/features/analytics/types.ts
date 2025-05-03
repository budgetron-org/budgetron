import type { InferResultType } from '~/server/db/types'

type CategorySpend = {
  categoryId: string
  categoryName: string
  categoryIcon: string
  parentCategoryId: string
  parentCategoryName: string
  parentCategoryIcon: string
  total: number
}

type MonthlySummary = {
  month: number
  year: number
  income: number
  expense: number
}

type TransactionWithRelations = InferResultType<
  'TransactionTable',
  {
    bankAccountId: false
    categoryId: false
    createdAt: false
    groupId: false
    id: false
    updatedAt: false
    userId: false
  },
  { bankAccount: true; category: true; group: true }
>

export type { CategorySpend, MonthlySummary, TransactionWithRelations }
