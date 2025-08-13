import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod/v4'
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
  amount: true,
  categoryId: true,
})

const GetBudgetDetailsInputSchema = UpdateBudgetInputSchema.pick({
  id: true,
})
  .extend({
    fromDate: z.date(),
    toDate: z.date(),
  })
  .required()

export {
  BudgetFormSchema,
  CreateBudgetInputSchema,
  DeleteBudgetInputSchema,
  GetBudgetDetailsInputSchema,
  UpdateBudgetInputSchema,
}
