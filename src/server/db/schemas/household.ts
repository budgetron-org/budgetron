import { relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'

import { CurrencyEnum } from '../enums'
import { id } from '../utils'
import { CategoryTable } from './category'
import { HouseholdUserTable } from './household-user'
import { TransactionTable } from './transaction'
import { UserTable } from './user'

export const HouseholdTable = pgTable('households', {
  id,
  icon: text().notNull().default('house'),
  name: text().notNull(),
  currency: CurrencyEnum().notNull(),
  ownerId: uuid()
    .references(() => UserTable.id, { onDelete: 'cascade' })
    .notNull(),
})

export const HouseholdTableRelations = relations(
  HouseholdTable,
  ({ one, many }) => ({
    categories: many(CategoryTable),
    members: many(HouseholdUserTable),
    owner: one(UserTable, {
      fields: [HouseholdTable.ownerId],
      references: [UserTable.id],
    }),
    transactions: many(TransactionTable),
  }),
)
