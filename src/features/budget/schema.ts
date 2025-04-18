import { createInsertSchema } from 'drizzle-zod'
import { BudgetTable } from '~/db/schema'

export const CreateBudgetSchema = createInsertSchema(BudgetTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
export const CreateBudgetSchemaWithoutUser = createInsertSchema(
  BudgetTable,
).omit({ userId: true })
