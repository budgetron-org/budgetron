import { z } from 'zod/v4'

const DateRangeSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
})

const GetCategorySpendIncomeInputSchema = DateRangeSchema.extend({
  limit: z.number().min(1),
})

const CashFlowReportRangeSchema = z.enum([
  'this_month',
  'last_3_months',
  'last_6_months',
  'ytd',
  '1_year',
  'all',
])

const GetCashFlowReportInputSchema = z.object({
  range: CashFlowReportRangeSchema,
})

export {
  CashFlowReportRangeSchema,
  GetCashFlowReportInputSchema,
  GetCategorySpendIncomeInputSchema,
}
