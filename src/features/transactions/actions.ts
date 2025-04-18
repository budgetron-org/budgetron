'use server'

import { eq } from 'drizzle-orm'
import { unauthorized } from 'next/navigation'
import { z } from 'zod'

import { db } from '~/db'
import { BankAccountTable, HouseholdTable } from '~/db/schema'
import { parseTransactions } from '~/lib/ofx-parser/ofx-parser'
import type { AsyncResult, AwaitedReturnType } from '~/types/generic'
import { getCurrentUser } from '../auth/service'
import {
  CreateTransactionSchema,
  CreateTransactionSchemaWithoutUser,
  ParseOFXSchema,
} from './schema'
import { insertManyTransactions, insertTransaction } from './service'

export async function createTransaction(
  UNSAFE_data: z.infer<typeof CreateTransactionSchemaWithoutUser>,
): AsyncResult<AwaitedReturnType<typeof insertTransaction>> {
  const { userId } = await getCurrentUser()
  if (!userId) unauthorized()

  const { error, data } = await CreateTransactionSchema.safeParseAsync({
    ...UNSAFE_data,
    userId,
  })
  if (error) return { success: false, error, message: 'Invalid input' }

  try {
    const transaction = await insertTransaction({
      bankAccountId: data.bankAccountId,
      amount: data.amount,
      categoryId: data.categoryId,
      currency: 'USD',
      date: data.date,
      description: data.description,
      externalId: data.externalId,
      householdId: data.householdId,
      type: data.type,
      userId: data.userId,
    })
    return { success: true, data: transaction }
  } catch (error) {
    return {
      success: false,
      message: `Error creating transaction: ${error instanceof Error ? error.message : 'Unknwon error'}.`,
    }
  }
}

export async function createMultipleTransactions(
  UNSAFE_data: z.infer<typeof CreateTransactionSchemaWithoutUser>[],
): AsyncResult<AwaitedReturnType<typeof insertManyTransactions>> {
  const { userId } = await getCurrentUser()
  if (!userId) unauthorized()

  const { error, data } = await z
    .array(
      CreateTransactionSchema.extend({
        userId: CreateTransactionSchema.shape.userId.default(userId),
      }),
    )
    .min(1)
    .safeParse(UNSAFE_data)
  if (error) return { success: false, error, message: 'Invalid input' }

  try {
    const transactions = await insertManyTransactions(data)
    return { success: true, data: transactions }
  } catch (error) {
    return {
      success: false,
      message: `Error creating transactions: ${error instanceof Error ? error.message : 'Unknwon error'}.`,
    }
  }
}

export async function parseOFXFile(
  UNSAFE_data: z.infer<typeof ParseOFXSchema>,
): AsyncResult<AwaitedReturnType<typeof parseTransactions>> {
  const { userId } = await getCurrentUser()
  if (!userId) unauthorized()

  const { error, data } = await ParseOFXSchema.safeParseAsync({
    ...UNSAFE_data,
    ownerId: userId,
  })
  if (error) return { success: false, message: 'Invalid inputs', error }

  // fetch account
  const [account] = await db
    .select()
    .from(BankAccountTable)
    .where(eq(BankAccountTable.id, data.bankAccountId))
    .limit(1)
  if (!account)
    return {
      success: false,
      message: `Unable to find the account with ID={${data.bankAccountId}}`,
    }

  // fetch household
  const [household] = data.householdId
    ? await db
        .select()
        .from(HouseholdTable)
        .where(eq(HouseholdTable.id, data.householdId))
        .limit(1)
    : []
  if (data.householdId && !household)
    return {
      success: false,
      message: `Unable to find the household with ID={${data.householdId}}`,
    }

  try {
    const transactions = await parseTransactions(data.file, account, household)
    return { success: true, data: transactions }
  } catch (error) {
    return {
      success: false,
      message: `Error parsing transactions from the OFX file: ${error instanceof Error ? error.message : 'Unknwon error'}.`,
    }
  }
}
