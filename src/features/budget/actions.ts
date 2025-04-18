'use server'

import { unauthorized } from 'next/navigation'
import { z } from 'zod'

import type { AsyncResult, AwaitedReturnType } from '~/types/generic'
import { getCurrentUser } from '../auth/service'
import { CreateBudgetSchema, CreateBudgetSchemaWithoutUser } from './schema'
import { insertManyBudgets } from './service'

export async function updateBudget(
  UNSAFE_data: z.infer<typeof CreateBudgetSchemaWithoutUser>[],
): AsyncResult<AwaitedReturnType<typeof insertManyBudgets>> {
  const { userId } = await getCurrentUser()
  if (!userId) return unauthorized()

  const { data, error } = z
    .array(
      CreateBudgetSchema.extend({
        userId: CreateBudgetSchema.shape.userId.default(userId),
      }),
    )
    .min(1)
    .safeParse(UNSAFE_data)
  if (error) return { success: false, message: error.message, error }

  try {
    const budgets = await insertManyBudgets(data)
    return { success: true, data: budgets }
  } catch (error) {
    return {
      success: false,
      message: `Error creating budget: ${error instanceof Error ? error.message : 'Unknwon error'}.`,
    }
  }
}
