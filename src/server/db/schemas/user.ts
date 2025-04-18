import { relations } from 'drizzle-orm'
import { boolean, pgTable, text } from 'drizzle-orm/pg-core'

import { createdAt, id, updatedAt } from '../utils'
import { BankAccountTable } from './bank-account'
import { BudgetTable } from './budget'
import { CategoryTable } from './category'
import { HouseholdTable } from './household'
import { HouseholdUserTable } from './household-user'
import { TransactionTable } from './transaction'
import { UserSettingsTable } from './user-settings'

export const UserTable = pgTable('users', {
  id,
  firstName: text().notNull(),
  lastName: text().notNull(),
  fullName: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().default(false),
  image: text(),
  createdAt,
  updatedAt,
})

export const UserRelations = relations(UserTable, ({ one, many }) => ({
  bankAccounts: many(BankAccountTable),
  categories: many(CategoryTable),
  households: many(HouseholdTable),
  member: many(HouseholdUserTable),
  settings: one(UserSettingsTable),
  transactions: many(TransactionTable),
  budgets: many(BudgetTable),
}))
