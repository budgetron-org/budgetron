import type { CurrencyCode } from '~/data/currencies'
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
}

type DetailedTransaction = TransactionWithRelations & {
  cashFlow: TransactionCashFlow

  currencyExchangeDetails: {
    hasConversionRate: boolean
    amountInBaseCurrency: Intl.StringNumericLiteral
    baseCurrency: CurrencyCode
    conversionRate: Intl.StringNumericLiteral
    date: Date
  }
}

export type {
  DetailedTransaction,
  Transaction,
  TransactionCashFlow,
  TransactionWithRelations,
}
