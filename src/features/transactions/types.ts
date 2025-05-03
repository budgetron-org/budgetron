import type { InferResultType } from '~/server/db/types'

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

export type { TransactionWithRelations }
