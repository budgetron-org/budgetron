import { z } from 'zod/v4'

const DateRangeSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
})

const GetMonthlySummaryInputSchema = DateRangeSchema

const GetCategorySpendIncomeInputSchema = DateRangeSchema.extend({
  limit: z.number().min(1),
})

export { GetCategorySpendIncomeInputSchema, GetMonthlySummaryInputSchema }
