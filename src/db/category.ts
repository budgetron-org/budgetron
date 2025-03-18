import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const category = {
  create(args: Prisma.CategoryCreateArgs) {
    return prisma.category.create(args)
  },
  findMany(args: Prisma.CategoryFindManyArgs) {
    return prisma.category.findMany(args)
  },
  getAllForHousehold(
    householdId: string,
    doNotIncludeCommonCategories = false,
  ) {
    return this.findMany({
      where: doNotIncludeCommonCategories
        ? { householdId }
        : {
            OR: [{ householdId }, { householdId: null, userId: null }],
          },
    })
  },
  getAllForUser(userId: string, doNotIncludeCommonCategories = false) {
    return this.findMany({
      where: doNotIncludeCommonCategories
        ? { userId }
        : {
            OR: [{ userId }, { userId: null }],
          },
    })
  },
  async contains(args: Prisma.CategoryFindFirstArgs) {
    return (await prisma.category.findFirst(args)) !== null
  },
}
