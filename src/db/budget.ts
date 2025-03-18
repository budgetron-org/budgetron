import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const budget = {
  findMany(args: Prisma.BudgetFindManyArgs) {
    return prisma.budget.findMany(args)
  },
  getAllForUser(userId: string) {
    return this.findMany({
      where: { userId },
    })
  },
  createOrUpdate(args: Prisma.BudgetUpsertArgs) {
    return prisma.budget.upsert(args)
  },
  delete(args: Prisma.BudgetDeleteArgs) {
    return prisma.budget.delete(args)
  },
  deleteMany(args: Prisma.BudgetDeleteManyArgs) {
    return prisma.budget.deleteMany(args)
  },
}
