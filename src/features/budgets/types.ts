import type { BudgetTable } from '~/server/db/schema'

type Budget = typeof BudgetTable.$inferSelect

type BudgetWithRelations = Pick<
  Budget,
  'id' | 'amount' | 'createdAt' | 'updatedAt'
> & {
  categoryId: string
  categoryName: string
  categoryIcon: string

  parentCategoryId: string | null
  parentCategoryName: string | null
  parentCategoryIcon: string | null
}

type BudgetSummary = BudgetWithRelations & {
  oneYearAverage: Intl.StringNumericLiteral
  last3MonthAverage: Intl.StringNumericLiteral
  ytdSpend: Intl.StringNumericLiteral
  lastMonthSpend: Intl.StringNumericLiteral
  thisMonthSpend: Intl.StringNumericLiteral
  projectedSpend: Intl.StringNumericLiteral
}

type BudgetDetails = {
  budgetSummary: BudgetSummary
  monthlyAverages: {
    month: string
    average: Intl.StringNumericLiteral
  }[]
}

export type { Budget, BudgetDetails, BudgetSummary }
