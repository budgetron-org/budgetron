import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

export const yearAggregation = {
  findAll(args: Prisma.YearAggregationFindManyArgs) {
    return prisma.yearAggregation.findMany(args)
  },
  getSummaryForYear(userId: string, year: number) {
    return this.findAll({ where: { userId, year }, orderBy: { month: 'asc' } })
  },
  getEarliest(userId: string) {
    return prisma.yearAggregation.findFirst({
      select: { year: true },
      where: { userId },
      orderBy: [{ year: 'asc' }],
    })
  },
}
