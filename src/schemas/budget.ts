import { z } from 'zod'

import { BudgetSchema } from '@/prisma/schemas'

export const BudgetFormSchema = z.record(
  z.string(),
  z
    .string()
    .optional()
    .refine(
      (val) => (val ? !Number.isNaN(Number.parseFloat(val)) : true),
      'Enter a valid number in this format ##.##',
    ),
)

export const BudgetSchemaWithoutUser = BudgetSchema.pick({
  categoryId: true,
  amount: true,
}).extend({
  amount: z
    .string()
    .optional()
    .refine((val) => (val ? !Number.isNaN(Number.parseFloat(val)) : true)),
})
