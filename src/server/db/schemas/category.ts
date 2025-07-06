import { relations } from 'drizzle-orm'
import {
  pgTable,
  text,
  unique,
  uuid,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core'

import { createdAt, id, updatedAt } from '../utils'
import { TransactionTypeEnum } from './enums'
import { GroupTable } from './group'
import { TransactionTable } from './transaction'
import { UserTable } from './user'

const CategoryTable = pgTable(
  'categories',
  {
    id,
    name: text().notNull(),
    icon: text().notNull(),
    type: TransactionTypeEnum().notNull(),
    parentId: uuid().references((): AnyPgColumn => CategoryTable.id, {
      onDelete: 'cascade',
    }),
    groupId: uuid().references(() => GroupTable.id, {
      onDelete: 'cascade',
    }),
    userId: uuid().references(() => UserTable.id, { onDelete: 'cascade' }),
    createdAt,
    updatedAt,
  },
  (t) => [unique().on(t.groupId, t.name, t.type, t.userId)],
)

const CategoryRelations = relations(CategoryTable, ({ one, many }) => ({
  parent: one(CategoryTable, {
    fields: [CategoryTable.parentId],
    references: [CategoryTable.id],
  }),
  group: one(GroupTable, {
    fields: [CategoryTable.groupId],
    references: [GroupTable.id],
  }),
  transactions: many(TransactionTable),
  user: one(UserTable, {
    fields: [CategoryTable.userId],
    references: [UserTable.id],
  }),
}))

export { CategoryRelations, CategoryTable }
