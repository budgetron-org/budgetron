import type { InferResultType } from '~/db/types'

export type TransactionWithRelations = InferResultType<
  'TransactionTable',
  {
    bankAccountId: false
    categoryId: false
    createdAt: false
    householdId: false
    id: false
    updatedAt: false
    userId: false
  },
  { account: true; category: true; household: true }
>
