import { relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'

import { createdAt, id, updatedAt } from '../utils'
import { UserTable } from './user'

const UserSettingsTable = pgTable('user_settings', {
  id,
  userId: uuid()
    .references(() => UserTable.id, { onDelete: 'cascade' })
    .notNull(),
  currency: text().notNull().default('USD'),
  createdAt,
  updatedAt,
})

const UserSettingsRelations = relations(UserSettingsTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [UserSettingsTable.userId],
    references: [UserTable.id],
  }),
}))

export { UserSettingsRelations, UserSettingsTable }
