import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const user = {
  create(args: Prisma.UserCreateArgs) {
    return prisma.user.create(args)
  },
  delete(args: Prisma.UserDeleteArgs) {
    return prisma.user.delete(args)
  },
}
