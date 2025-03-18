import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

export const monthAggregation = {
  findAll(args: Prisma.MonthAggregationFindManyArgs) {
    return prisma.monthAggregation.findMany(args)
  },
  getSummaryForMonth(userId: string, month: number, year: number) {
    return this.findAll({
      where: { userId, month, year },
      orderBy: { day: 'asc' },
    })
  },
  getEarliest(userId: string) {
    return prisma.monthAggregation.findFirst({
      select: { year: true, month: true },
      where: { userId },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    })
  },
}
