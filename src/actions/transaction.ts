'use server'

import { auth } from '@clerk/nextjs/server'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

import { account } from '@/db/account'
import { category } from '@/db/category'
import { household } from '@/db/household'
import { transaction } from '@/db/transaction'
import { parseTransactions } from '@/lib/ofx-parser'
import {
  CreateTransactionSchema,
  CreateTransactionSchemaWithoutUser,
  ParseOFXSchema,
} from '@/schemas/transaction'

const CreateTransactionSchemaWithDBValidation = CreateTransactionSchema.refine(
  async ({ accountId, categoryId, householdId, userId }) => {
    const hasAccount = accountId
      ? account.contains({ where: { id: accountId, userId } })
      : true
    const hasCategory = categoryId
      ? category.contains({
          where: {
            OR: [
              { id: categoryId, userId },
              { id: categoryId, userId: null },
            ],
          },
        })
      : true
    const hasHousehold = householdId
      ? household.contains({
          where: {
            OR: [
              { id: householdId, ownerId: userId },
              { id: householdId, members: { some: { userId } } },
            ],
          },
        })
      : true

    return (await Promise.all([hasAccount, hasCategory, hasHousehold])).every(
      Boolean,
    )
  },
)

export async function createTransaction(
  UNSAFE_data: z.infer<typeof CreateTransactionSchemaWithoutUser>,
) {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const { appUserId } = sessionClaims?.metadata ?? {}

  if (!userId || !appUserId) {
    redirectToSignIn()
    return
  }

  const { error, data } =
    await CreateTransactionSchemaWithDBValidation.safeParseAsync({
      ...UNSAFE_data,
      userId: appUserId,
    })

  if (error) {
    throw error
  }

  const transactionEntry = await transaction.create({
    data: {
      accountId: data.accountId,
      amount: new Prisma.Decimal(data.amount),
      categoryId: data.categoryId,
      currency: 'USD',
      date: data.date,
      description: data.description,
      externalId: data.externalId,
      householdId: data.householdId,
      type: data.type,
      userId: data.userId,
    },
  })

  return transactionEntry
}

export async function createMultipleTransactions(
  UNSAFE_data: z.infer<typeof CreateTransactionSchemaWithoutUser>[],
) {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const { appUserId } = sessionClaims?.metadata ?? {}

  if (!userId || !appUserId) {
    redirectToSignIn()
    return
  }

  const { error, data } = await z
    .array(CreateTransactionSchemaWithDBValidation)
    .safeParseAsync(UNSAFE_data.map((d) => ({ ...d, userId: appUserId })))

  if (error) {
    throw error
  }

  await transaction.createMany({ data })
}

export async function parseOFXFile(
  UNSAFE_data: z.infer<typeof ParseOFXSchema>,
) {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const { appUserId } = sessionClaims?.metadata ?? {}

  if (!userId || !appUserId) {
    return redirectToSignIn()
  }

  const { error, data } = await ParseOFXSchema.safeParseAsync({
    ...UNSAFE_data,
    ownerId: appUserId,
  })

  if (error) {
    throw error
  }

  const accountForTransactions = await account.find({
    where: { userId: appUserId, id: data.accountId },
  })

  if (!accountForTransactions) {
    throw Error('Account ID is not valid')
  }

  const householdForTransaction = data.householdId
    ? await household.find({ where: { ownerId: userId, id: data.householdId } })
    : undefined

  return await parseTransactions(
    data.file,
    accountForTransactions,
    householdForTransaction,
  )
}
