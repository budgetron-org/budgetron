import { relations } from 'drizzle-orm'
import { decimal, pgTable, text, unique, uuid } from 'drizzle-orm/pg-core'

import { createdAt, currencyType, id, updatedAt } from '../utils'
import { BankAccountTypeEnum } from './enums'
import { TransactionTable } from './transaction'
import { UserTable } from './user'

const BankAccountTable = pgTable(
  'bank_accounts',
  {
    id,
    name: text().notNull(),
    type: BankAccountTypeEnum().notNull(),
    balance: decimal().notNull().default('0'),
    currency: currencyType().notNull().default('USD'),
    userId: uuid()
      .references(() => UserTable.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt,
    updatedAt,
  },
  (t) => [unique().on(t.name, t.type, t.userId)],
)

const BankAccountRelations = relations(BankAccountTable, ({ one, many }) => ({
  transactions: many(TransactionTable, {
    relationName: 'bankAccount',
  }),
  user: one(UserTable, {
    fields: [BankAccountTable.userId],
    references: [UserTable.id],
  }),
}))

export { BankAccountRelations, BankAccountTable }
