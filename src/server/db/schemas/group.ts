import { relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'

import { createdAt, currencyType, id, updatedAt } from '../utils'
import { CategoryTable } from './category'
import { GroupUserTable } from './group-user'
import { TransactionTable } from './transaction'
import { UserTable } from './user'

const GroupTable = pgTable('groups', {
  id,
  icon: text().notNull().default('house'),
  name: text().notNull(),
  currency: currencyType().notNull().default('USD'),
  ownerId: uuid()
    .references(() => UserTable.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt,
  updatedAt,
})

const GroupTableRelations = relations(GroupTable, ({ one, many }) => ({
  categories: many(CategoryTable),
  members: many(GroupUserTable),
  owner: one(UserTable, {
    fields: [GroupTable.ownerId],
    references: [UserTable.id],
  }),
  transactions: many(TransactionTable),
}))

export { GroupTable, GroupTableRelations }
