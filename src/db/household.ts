import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const household = {
  create(args: Prisma.HouseholdCreateArgs) {
    return prisma.household.create(args)
  },
  findAll(args: Prisma.HouseholdFindManyArgs) {
    return prisma.household.findMany(args)
  },
  find(args: Prisma.HouseholdFindFirstArgs) {
    return prisma.household.findFirst(args)
  },
  getAllForUser(userId: string) {
    return this.findAll({
      where: {
        OR: [{ ownerId: userId }],
      },
    })
  },
  async contains(args: Prisma.HouseholdFindFirstArgs) {
    return (await this.find(args)) !== null
  },
}
