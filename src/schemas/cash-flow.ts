import { range } from 'lodash'
import { z } from 'zod'

const validMonths = range(0, 12)
export const GetCashFlowStatsSchema = z.object({
  timeFrame: z.enum(['month', 'year']),
  month: z.coerce
    .number()
    .refine(
      (val) => validMonths.includes(val),
      'Enter a valid month (0 to 11)',
    ),
  year: z.coerce.number(),
})
