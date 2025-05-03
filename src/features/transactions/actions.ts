'use server'

import { eq } from 'drizzle-orm'
import { unauthorized } from 'next/navigation'
import { z } from 'zod'

import { parseTransactions } from '~/lib/ofx-parser/ofx-parser'
import { api } from '~/rpc/server'
import { db } from '~/server/db'
import { BankAccountTable, GroupTable } from '~/server/db/schema'
import type { AsyncResult, AwaitedReturnType } from '~/types/generic'
import { insertManyTransactions, insertTransaction } from './service'
import {
  AddTransactionInputSchema,
  CreateTransactionSchema,
  ParseOFXInputSchema,
} from './validators'

async function createTransaction(
  UNSAFE_data: z.infer<typeof AddTransactionInputSchema>,
): AsyncResult<AwaitedReturnType<typeof insertTransaction>> {
  const session = await api.auth.session()
  if (!session?.user) unauthorized()

  const { error, data } = await CreateTransactionSchema.safeParseAsync({
    ...UNSAFE_data,
    userId: session.user.id,
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
      groupId: data.groupId,
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

async function createMultipleTransactions(
  UNSAFE_data: z.infer<typeof AddTransactionInputSchema>[],
): AsyncResult<AwaitedReturnType<typeof insertManyTransactions>> {
  const session = await api.auth.session()
  if (!session?.user) unauthorized()

  const { error, data } = z
    .array(
      CreateTransactionSchema.extend({
        userId: CreateTransactionSchema.shape.userId.default(session.user.id),
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

async function parseOFXFile(
  UNSAFE_data: z.infer<typeof ParseOFXInputSchema>,
): AsyncResult<AwaitedReturnType<typeof parseTransactions>> {
  const session = await api.auth.session()
  if (!session?.user) unauthorized()

  const { error, data } = await ParseOFXInputSchema.safeParseAsync({
    ...UNSAFE_data,
    ownerId: session.user.id,
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

  // fetch group
  const [group] = data.groupId
    ? await db
        .select()
        .from(GroupTable)
        .where(eq(GroupTable.id, data.groupId))
        .limit(1)
    : []
  if (data.groupId && !group)
    return {
      success: false,
      message: `Unable to find the group with ID={${data.groupId}}`,
    }

  try {
    const transactions = await parseTransactions(data.file, account, group)
    return { success: true, data: transactions }
  } catch (error) {
    return {
      success: false,
      message: `Error parsing transactions from the OFX file: ${error instanceof Error ? error.message : 'Unknwon error'}.`,
    }
  }
}

export { createMultipleTransactions, createTransaction, parseOFXFile }
