import { relations } from 'drizzle-orm'
import { pgTable, uuid } from 'drizzle-orm/pg-core'

import { CurrencyEnum } from '../enums'
import { createdAt, id, updatedAt } from '../utils'
import { UserTable } from './user'

export const UserSettingsTable = pgTable('user_settings', {
  id,
  userId: uuid()
    .references(() => UserTable.id, { onDelete: 'cascade' })
    .notNull(),
  currency: CurrencyEnum().notNull(),
  createdAt,
  updatedAt,
})

export const UserSettingsRelations = relations(
  UserSettingsTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UserSettingsTable.userId],
      references: [UserTable.id],
    }),
  }),
)
