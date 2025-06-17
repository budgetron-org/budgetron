import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { BudgetTable } from '~/server/db/schema'

const CreateBudgetInputSchema = createInsertSchema(BudgetTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
})

const UpdateBudgetSchema = createUpdateSchema(BudgetTable)
const UpdateBudgetInputSchema = UpdateBudgetSchema.omit({
  createdAt: true,
  updatedAt: true,
  userId: true,
}).required()

const DeleteBudgetInputSchema = createUpdateSchema(BudgetTable)
  .pick({
    id: true,
  })
  .required()

const BudgetFormSchema = CreateBudgetInputSchema.pick({
  categoryId: true,
}).extend({
  amount: CreateBudgetInputSchema.shape.amount.nonempty('Amount is required'),
})

const GetBudgetDetailsInputSchema = UpdateBudgetInputSchema.pick({
  id: true,
}).required()

export {
  BudgetFormSchema,
  CreateBudgetInputSchema,
  DeleteBudgetInputSchema,
  GetBudgetDetailsInputSchema,
  UpdateBudgetInputSchema,
}
