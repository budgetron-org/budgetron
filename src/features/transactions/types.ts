import type { TransactionTable } from '~/server/db/schema'
import type { AwaitedReturnType } from '~/types/shared'
import { selectTransactions } from './service'

type Transaction = typeof TransactionTable.$inferSelect

type TransactionWithRelations = AwaitedReturnType<
  typeof selectTransactions
>[number]

export type { Transaction, TransactionWithRelations }
