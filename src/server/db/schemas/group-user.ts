import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'

import { createdAt, updatedAt } from '../utils'
import { GroupTable } from './group'
import { UserTable } from './user'

export const GroupUserTable = pgTable(
  'groups_users',
  {
    groupId: uuid()
      .references(() => GroupTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    userId: uuid()
      .references(() => UserTable.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt,
    updatedAt,
  },
  (t) => [primaryKey({ columns: [t.groupId, t.userId] })],
)

export const GroupUserRelations = relations(GroupUserTable, ({ one }) => ({
  group: one(GroupTable, {
    fields: [GroupUserTable.groupId],
    references: [GroupTable.id],
  }),
  user: one(UserTable, {
    fields: [GroupUserTable.userId],
    references: [UserTable.id],
  }),
}))
