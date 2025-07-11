import { relations } from 'drizzle-orm'
import { date, index, pgTable, text, uuid } from 'drizzle-orm/pg-core'

import { createdAt, currencyType, id, moneyType, updatedAt } from '../utils'
import { BankAccountTable } from './bank-account'
import { CategoryTable } from './category'
import { TransactionTypeEnum } from './enums'
import { GroupTable } from './group'
import { UserTable } from './user'

const TransactionTable = pgTable(
  'transactions',
  {
    id,
    externalId: text().unique(),
    createdAt,
    updatedAt,
    type: TransactionTypeEnum().notNull().default('EXPENSE'),
    date: date({ mode: 'date' }).notNull(),
    amount: moneyType().notNull(),
    currency: currencyType().notNull().default('USD'),
    description: text().notNull(),
    notes: text(),
    tags: text().array(),
    bankAccountId: uuid().references(() => BankAccountTable.id, {
      onDelete: 'set null',
    }),
    // Applicable only for transfer transactions
    fromBankAccountId: uuid().references(() => BankAccountTable.id, {
      onDelete: 'set null',
    }),
    // Applicable only for transfer transactions
    toBankAccountId: uuid().references(() => BankAccountTable.id, {
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

const TransactionRelations = relations(TransactionTable, ({ one }) => ({
  bankAccount: one(BankAccountTable, {
    fields: [TransactionTable.bankAccountId],
    references: [BankAccountTable.id],
    relationName: 'bankAccount',
  }),
  fromBankAccount: one(BankAccountTable, {
    fields: [TransactionTable.fromBankAccountId],
    references: [BankAccountTable.id],
    relationName: 'fromBankAccount',
  }),
  toBankAccount: one(BankAccountTable, {
    fields: [TransactionTable.toBankAccountId],
    references: [BankAccountTable.id],
    relationName: 'toBankAccount',
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

export { TransactionRelations, TransactionTable }
