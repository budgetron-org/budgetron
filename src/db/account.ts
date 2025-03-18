import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const account = {
  create(args: Prisma.AccountCreateArgs) {
    return prisma.account.create(args)
  },
  findAll(args: Prisma.AccountFindManyArgs) {
    return prisma.account.findMany(args)
  },
  find(args: Prisma.AccountFindFirstArgs) {
    return prisma.account.findFirst(args)
  },
  getAllForUser(userId: string) {
    return this.findAll({
      where: { userId },
    })
  },
  async contains(args: Prisma.AccountFindFirstArgs) {
    return (await this.find(args)) !== null
  },
}
