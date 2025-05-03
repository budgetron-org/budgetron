import { pgEnum } from 'drizzle-orm/pg-core'

export const BankAccountTypes = ['CHECKING', 'SAVINGS', 'CREDIT'] as const
export type BankAccountType = (typeof BankAccountTypes)[number]
export const BankAccountTypeEnum = pgEnum(
  'bank_account_type_enum',
  BankAccountTypes,
)

export const Currencies = ['USD', 'INR'] as const
export type Currency = (typeof Currencies)[number]
export const CurrencyEnum = pgEnum('currency_enum', Currencies)

export const TransactionTypes = ['income', 'expense'] as const
export type TransactionType = (typeof TransactionTypes)[number]
export const TransactionTypeEnum = pgEnum(
  'transaction_type_enum',
  TransactionTypes,
)
