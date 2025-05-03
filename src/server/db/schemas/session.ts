import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { createdAt, id, updatedAt } from '../utils'
import { UserTable } from './user'

export const SessionTable = pgTable('sessions', {
  id,
  expiresAt: timestamp().notNull(),
  token: text().notNull().unique(),
  ipAddress: text(),
  userAgent: text(),
  userId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: 'cascade' }),
  createdAt,
  updatedAt,
})

export const SessionRelation = relations(SessionTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [SessionTable.userId],
    references: [UserTable.id],
  }),
}))
