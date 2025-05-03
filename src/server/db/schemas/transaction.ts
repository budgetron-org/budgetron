import { relations } from 'drizzle-orm'
import { date, decimal, index, pgTable, text, uuid } from 'drizzle-orm/pg-core'

import { CurrencyEnum, TransactionTypeEnum } from '../enums'
import { createdAt, id, updatedAt } from '../utils'
import { BankAccountTable } from './bank-account'
import { CategoryTable } from './category'
import { GroupTable } from './group'
import { UserTable } from './user'

export const TransactionTable = pgTable(
  'transactions',
  {
    id,
    externalId: text().unique(),
    createdAt,
    updatedAt,
    type: TransactionTypeEnum().notNull().default('expense'),
    date: date({ mode: 'date' }).notNull(),
    amount: decimal().notNull(),
    currency: CurrencyEnum().notNull(),
    description: text().notNull(),
    bankAccountId: uuid().references(() => BankAccountTable.id, {
      onDelete: 'set null',
    }),
    categoryId: uuid().references(() => CategoryTable.id, {
      onDelete: 'set null',
    }),
    groupId: uuid().references(() => GroupTable.id, {
      onDelete: 'cascade',
    }),
    userId: uuid()
      .references(() => UserTable.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (t) => [index().on(t.categoryId, t.date, t.groupId, t.userId)],
)

export const TransactionRelations = relations(TransactionTable, ({ one }) => ({
  bankAccount: one(BankAccountTable, {
    fields: [TransactionTable.bankAccountId],
    references: [BankAccountTable.id],
  }),
  category: one(CategoryTable, {
    fields: [TransactionTable.categoryId],
    references: [CategoryTable.id],
  }),
  group: one(GroupTable, {
    fields: [TransactionTable.groupId],
    references: [GroupTable.id],
  }),
  user: one(UserTable, {
    fields: [TransactionTable.userId],
    references: [UserTable.id],
  }),
}))
