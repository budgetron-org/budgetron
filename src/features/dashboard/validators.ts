import { isAfter } from 'date-fns'
import { z } from 'zod'

import { TransactionTypes } from '~/server/db/enums'

const MonthYearSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number(),
})

const AggregateByMonthInputSchema = z
  .object({
    type: z.enum(TransactionTypes),
    from: MonthYearSchema,
    to: MonthYearSchema,
  })
  .refine(
    ({ from, to }) =>
      isAfter(new Date(to.year, to.month), new Date(from.year, from.month)),
    {
      message: 'To month/year should be after the From month/year',
    },
  )

export { AggregateByMonthInputSchema }
