'use server'

import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

import { BudgetSchemaWithoutUser } from '@/schemas/budget'
import { prisma } from '@/lib/prisma'
import { budget } from '@/db/budget'
import { Prisma } from '@prisma/client'

const UpdateBudgetSchema = z.array(BudgetSchemaWithoutUser)

export async function updateBudget(
  UNSAFE_data: z.infer<typeof UpdateBudgetSchema>,
) {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const { appUserId } = sessionClaims?.metadata ?? {}

  if (!userId || !appUserId) {
    redirectToSignIn()
    return
  }

  const { data, error } = UpdateBudgetSchema.safeParse(UNSAFE_data)

  if (error) {
    throw error
  }

  if (data.length === 0) {
    throw new Error('No data to update')
  }

  // filter out rows to delete
  // if amount is empty string or undefined, then remove that from budget
  const dataByOperation = Object.groupBy(data, ({ amount }) =>
    amount ? 'toUpsert' : 'toDelete',
  )

  await prisma.$transaction([
    budget.deleteMany({
      where: {
        userId: appUserId,
        categoryId: {
          in: dataByOperation.toDelete?.map(({ categoryId }) => categoryId),
        },
      },
    }),
    ...(dataByOperation.toUpsert ?? [])?.map(({ categoryId, amount }) => {
      // if amount is empty string or undefined, then remove that from budget
      if (amount === undefined || amount === '') {
        return budget.delete({
          where: {
            userId_categoryId: {
              userId: appUserId,
              categoryId,
            },
          },
        })
      }
      // if the amount is non-empty string, then update/create budget
      return budget.createOrUpdate({
        where: {
          userId_categoryId: {
            userId: appUserId,
            categoryId,
          },
        },

        create: {
          amount: new Prisma.Decimal(amount),
          categoryId,
          userId: appUserId,
        },

        update: {
          amount: new Prisma.Decimal(amount),
        },
      })
    }),
  ])
}
