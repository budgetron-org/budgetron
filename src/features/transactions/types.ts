import type { TransactionTable } from '~/server/db/schema'
import type { InferResultType } from '~/server/db/types'

type Transaction = typeof TransactionTable.$inferSelect

type TransactionWithRelations = InferResultType<
  'TransactionTable',
  undefined,
  { bankAccount: true; category: true; group: true }
>

export type { Transaction, TransactionWithRelations }
