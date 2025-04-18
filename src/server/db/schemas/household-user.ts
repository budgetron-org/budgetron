import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'

import { createdAt, updatedAt } from '../utils'
import { HouseholdTable } from './household'
import { UserTable } from './user'

export const HouseholdUserTable = pgTable(
  'households_users',
  {
    householdId: uuid()
      .references(() => HouseholdTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    userId: uuid()
      .references(() => UserTable.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt,
    updatedAt,
  },
  (t) => [primaryKey({ columns: [t.householdId, t.userId] })],
)

export const HouseholdUserRelations = relations(
  HouseholdUserTable,
  ({ one }) => ({
    household: one(HouseholdTable, {
      fields: [HouseholdUserTable.householdId],
      references: [HouseholdTable.id],
    }),
    user: one(UserTable, {
      fields: [HouseholdUserTable.userId],
      references: [UserTable.id],
    }),
  }),
)
