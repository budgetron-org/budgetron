import { pgEnum } from 'drizzle-orm/pg-core'
import { CURRENCY_CODES } from '~/data/currencies'

export const Currencies = CURRENCY_CODES
export type Currency = (typeof Currencies)[number]
export const CurrencyEnum = pgEnum('currency_enum', Currencies)

export const TransactionTypes = ['income', 'expense'] as const
export type TransactionType = (typeof TransactionTypes)[number]
export const TransactionTypeEnum = pgEnum(
  'transaction_type_enum',
  TransactionTypes,
)
