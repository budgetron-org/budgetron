import type { TransactionTable } from '~/server/db/schema'
import type { InferResultType } from '~/server/db/types'

type Transaction = Pick<
  typeof TransactionTable.$inferSelect,
  'externalId' | 'description' | 'type' | 'amount'
>
type Category = InferResultType<'CategoryTable', undefined, { parent: true }>

export type { Category, Transaction }
