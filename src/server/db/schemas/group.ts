import { relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'

import { CurrencyEnum } from '../enums'
import { id } from '../utils'
import { CategoryTable } from './category'
import { GroupUserTable } from './group-user'
import { TransactionTable } from './transaction'
import { UserTable } from './user'

export const GroupTable = pgTable('groups', {
  id,
  icon: text().notNull().default('house'),
  name: text().notNull(),
  currency: CurrencyEnum().notNull(),
  ownerId: uuid()
    .references(() => UserTable.id, { onDelete: 'cascade' })
    .notNull(),
})

export const GroupTableRelations = relations(GroupTable, ({ one, many }) => ({
  categories: many(CategoryTable),
  members: many(GroupUserTable),
  owner: one(UserTable, {
    fields: [GroupTable.ownerId],
    references: [UserTable.id],
  }),
  transactions: many(TransactionTable),
}))
