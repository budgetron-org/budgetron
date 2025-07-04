import { pgEnum } from 'drizzle-orm/pg-core'

const BankAccountTypes = [
  'CHECKING',
  'CREDIT',
  'INVESTMENT',
  'SAVINGS',
] as const
type BankAccountType = (typeof BankAccountTypes)[number]
const BankAccountTypeEnum = pgEnum('bank_account_type_enum', BankAccountTypes)

const Currencies = ['USD', 'INR'] as const
type Currency = (typeof Currencies)[number]
const CurrencyEnum = pgEnum('currency_enum', Currencies)

const TransactionTypes = ['INCOME', 'EXPENSE', 'TRANSFER'] as const
type TransactionType = (typeof TransactionTypes)[number]
const TransactionTypeEnum = pgEnum('transaction_type_enum', TransactionTypes)

const UserRoleTypes = ['USER', 'ADMIN'] as const
type UserRoleType = (typeof UserRoleTypes)[number]
const UserRoleEnum = pgEnum('user_role_enum', UserRoleTypes)

export {
  BankAccountTypeEnum,
  BankAccountTypes,
  Currencies,
  CurrencyEnum,
  TransactionTypeEnum,
  TransactionTypes,
  UserRoleEnum,
  UserRoleTypes,
}
export type { BankAccountType, Currency, TransactionType, UserRoleType }
