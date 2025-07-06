import { pgEnum } from 'drizzle-orm/pg-core'

const BankAccountTypeEnum = pgEnum('bank_account_type_enum', [
  'CHECKING',
  'CREDIT',
  'INVESTMENT',
  'SAVINGS',
])

const TransactionTypeEnum = pgEnum('transaction_type_enum', [
  'INCOME',
  'EXPENSE',
  'TRANSFER',
])

const UserRoleEnum = pgEnum('user_role_enum', ['USER', 'ADMIN'])

export { BankAccountTypeEnum, TransactionTypeEnum, UserRoleEnum }
