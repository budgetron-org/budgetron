import { relations } from 'drizzle-orm'
import { pgTable, unique, uuid } from 'drizzle-orm/pg-core'

import { createdAt, id, moneyType, updatedAt } from '../utils'
import { CategoryTable } from './category'
import { UserTable } from './user'

const BudgetTable = pgTable(
  'budgets',
  {
    id,
    createdAt,
    updatedAt,
    categoryId: uuid()
      .references(() => CategoryTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    userId: uuid()
      .references(() => UserTable.id, { onDelete: 'cascade' })
      .notNull(),
    amount: moneyType().notNull(),
  },
  (t) => [unique().on(t.categoryId, t.userId)],
)

const BudgetRelations = relations(BudgetTable, ({ one }) => ({
  category: one(CategoryTable, {
    fields: [BudgetTable.categoryId],
    references: [CategoryTable.id],
  }),
  user: one(UserTable, {
    fields: [BudgetTable.userId],
    references: [UserTable.id],
  }),
}))

export { BudgetRelations, BudgetTable }
