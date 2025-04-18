import { relations } from 'drizzle-orm'
import { pgTable, text, unique, uuid } from 'drizzle-orm/pg-core'

import { TransactionTypeEnum } from '../enums'
import { createdAt, id, updatedAt } from '../utils'
import { HouseholdTable } from './household'
import { TransactionTable } from './transaction'
import { UserTable } from './user'

export const CategoryTable = pgTable(
  'categories',
  {
    id,
    name: text().notNull(),
    icon: text().notNull(),
    type: TransactionTypeEnum().notNull(),
    householdId: uuid().references(() => HouseholdTable.id, {
      onDelete: 'cascade',
    }),
    userId: uuid().references(() => UserTable.id, { onDelete: 'cascade' }),
    createdAt,
    updatedAt,
  },
  (t) => [unique().on(t.householdId, t.name, t.type, t.userId)],
)

export const CategoryRelations = relations(CategoryTable, ({ one, many }) => ({
  household: one(HouseholdTable, {
    fields: [CategoryTable.householdId],
    references: [HouseholdTable.id],
  }),
  transactions: many(TransactionTable),
  user: one(UserTable, {
    fields: [CategoryTable.userId],
    references: [UserTable.id],
  }),
}))
