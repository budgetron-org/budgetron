import { relations } from 'drizzle-orm'
import { pgTable, unique, uuid } from 'drizzle-orm/pg-core'

import { createdAt, currencyType, id, updatedAt } from '../utils'
import { UserTable } from './user'

const UserSettingsTable = pgTable(
  'user_settings',
  {
    id,
    userId: uuid()
      .references(() => UserTable.id, { onDelete: 'cascade' })
      .notNull(),
    currency: currencyType().notNull().default('USD'),
    createdAt,
    updatedAt,
  },
  (t) => [unique().on(t.userId)],
)

const UserSettingsRelations = relations(UserSettingsTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [UserSettingsTable.userId],
    references: [UserTable.id],
  }),
}))

export { UserSettingsRelations, UserSettingsTable }
