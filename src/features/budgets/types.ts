import type {
  BankAccountTable,
  BudgetTable,
  CategoryTable,
  GroupTable,
  TransactionTable,
} from '~/server/db/schema'

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
  amountFloat: number
  oneYearAverage: number
  last3MonthAverage: number
  ytdSpend: number
  lastMonthSpend: number
  thisMonthSpend: number
  projectedSpend: number
}

type BudgetDetails = {
  budgetSummary: BudgetSummary
  monthlyAverages: {
    month: string
    average: number
  }[]
  transactions: (typeof TransactionTable.$inferSelect & {
    bankAccount: typeof BankAccountTable.$inferSelect | null
    fromBankAccount: typeof BankAccountTable.$inferSelect | null
    toBankAccount: typeof BankAccountTable.$inferSelect | null
    category:
      | (typeof CategoryTable.$inferSelect & {
          parent: typeof CategoryTable.$inferSelect | null
        })
      | null
    group: typeof GroupTable.$inferSelect | null
    cashFlow: 'IN' | 'OUT'
  })[]
}

export type { Budget, BudgetDetails, BudgetSummary }
