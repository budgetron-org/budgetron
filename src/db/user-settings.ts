import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const userSettings = {
  create(args: Prisma.UserSettingsCreateArgs) {
    return prisma.userSettings.create(args)
  },

  find(args: Prisma.UserSettingsFindUniqueArgs) {
    return prisma.userSettings.findUnique(args)
  },

  async findOrCreate({
    where,
    data,
    select,
  }: {
    where: Prisma.UserSettingsFindUniqueArgs['where']
    data: Prisma.UserSettingsCreateInput
    select: Prisma.UserSettingsSelect
  }) {
    const result = await this.find({ where, select })
    if (result) return result

    // create a new entry since we did not find any
    return this.create({ data, select })
  },
}
