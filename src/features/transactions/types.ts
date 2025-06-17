import type {
  BankAccountTable,
  CategoryTable,
  GroupTable,
  TransactionTable,
} from '~/server/db/schema'

type TransactionCashFlow = 'IN' | 'OUT'

type Transaction = typeof TransactionTable.$inferSelect

type TransactionWithRelations = Transaction & {
  bankAccount: typeof BankAccountTable.$inferSelect | null
  fromBankAccount: typeof BankAccountTable.$inferSelect | null
  toBankAccount: typeof BankAccountTable.$inferSelect | null
  category:
    | (typeof CategoryTable.$inferSelect & {
        parent: typeof CategoryTable.$inferSelect | null
      })
    | null
  group: typeof GroupTable.$inferSelect | null

  // extras
  cashFlow: TransactionCashFlow
}

export type { Transaction, TransactionCashFlow, TransactionWithRelations }
