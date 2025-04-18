import { relations } from 'drizzle-orm'
import { pgTable, text, unique, uuid } from 'drizzle-orm/pg-core'

import { createdAt, id, updatedAt } from '../utils'
import { TransactionTable } from './transaction'
import { UserTable } from './user'

export const BankAccountTable = pgTable(
  'bank_accounts',
  {
    id,
    name: text().notNull(),
    userId: uuid()
      .references(() => UserTable.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt,
    updatedAt,
  },
  (t) => [unique().on(t.name, t.userId)],
)

export const BankAccountRelations = relations(
  BankAccountTable,
  ({ one, many }) => ({
    transactions: many(TransactionTable),
    user: one(UserTable, {
      fields: [BankAccountTable.userId],
      references: [UserTable.id],
    }),
  }),
)
