import { differenceInDays } from 'date-fns'
import { z } from 'zod'

import { MAX_STATS_DATE_RANGE_DAYS } from '@/lib/constants'
import { TransactionTypeSchema } from '@/prisma/schemas'

export const GetOverviewStatsSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine(({ from, to }) => {
    const days = differenceInDays(to, from)
    return days >= 0 && days <= MAX_STATS_DATE_RANGE_DAYS
  })

export const GetBudgetStatsSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
    type: TransactionTypeSchema,
  })
  .refine(({ from, to }) => {
    const days = differenceInDays(to, from)
    return days >= 0 && days <= MAX_STATS_DATE_RANGE_DAYS
  })
