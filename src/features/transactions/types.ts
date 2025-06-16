import type { TransactionTable } from '~/server/db/schema'
import type { AwaitedReturnType } from '~/types/shared'
import { selectTransactions } from './service'

type TransactionCashFlow = 'IN' | 'OUT'

type Transaction = typeof TransactionTable.$inferSelect

type TransactionWithRelations = AwaitedReturnType<
  typeof selectTransactions
>[number] & {
  cashFlow: TransactionCashFlow
}

export type { Transaction, TransactionCashFlow, TransactionWithRelations }
