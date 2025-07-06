import { relations } from 'drizzle-orm'
import { boolean, pgTable, text } from 'drizzle-orm/pg-core'

import { createdAt, id, updatedAt } from '../utils'
import { BankAccountTable } from './bank-account'
import { BudgetTable } from './budget'
import { CategoryTable } from './category'
import { UserRoleEnum } from './enums'
import { GroupTable } from './group'
import { GroupUserTable } from './group-user'
import { TransactionTable } from './transaction'
import { UserSettingsTable } from './user-settings'

const UserTable = pgTable('users', {
  id,
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().default(false),
  image: text(),
  role: UserRoleEnum().default('USER'),
  createdAt,
  updatedAt,
})

const UserRelations = relations(UserTable, ({ one, many }) => ({
  bankAccounts: many(BankAccountTable),
  categories: many(CategoryTable),
  groups: many(GroupTable),
  member: many(GroupUserTable),
  settings: one(UserSettingsTable),
  transactions: many(TransactionTable),
  budgets: many(BudgetTable),
}))

export { UserRelations, UserTable }
