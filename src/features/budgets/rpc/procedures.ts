import { createRPCErrorFromUnknownError } from '~/rpc/utils'
import { protectedProcedure } from '~/server/api/rpc'
import {
  deleteBudget,
  getBudgetDetails,
  getBudgetsSummary,
  insertBudget,
  updateBudget,
} from '../service'
import {
  CreateBudgetInputSchema,
  DeleteBudgetInputSchema,
  GetBudgetDetailsInputSchema,
  UpdateBudgetInputSchema,
} from '../validators'

const summary = protectedProcedure.handler(async ({ context }) => {
  const { user } = context.session

  try {
    const summary = await getBudgetsSummary({ userId: user.id })
    return summary
  } catch (error) {
    throw createRPCErrorFromUnknownError(error)
  }
})

const details = protectedProcedure
  .input(GetBudgetDetailsInputSchema)
  .handler(async ({ context, input }) => {
    const { user } = context.session

    try {
      const budget = await getBudgetDetails({
        ...input,
        userId: user.id,
      })
      return budget
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

const create = protectedProcedure
  .input(CreateBudgetInputSchema)
  .handler(async ({ context, input }) => {
    const { user } = context.session

    try {
      const budget = await insertBudget({
        ...input,
        userId: user.id,
      })
      return budget
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

const update = protectedProcedure
  .input(UpdateBudgetInputSchema)
  .handler(async ({ context, input }) => {
    const { user } = context.session

    try {
      const budget = await updateBudget({
        ...input,
        userId: user.id,
      })
      return budget
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

const _delete = protectedProcedure
  .input(DeleteBudgetInputSchema)
  .handler(async ({ context, input }) => {
    const { user } = context.session

    try {
      const budget = await deleteBudget({
        ...input,
        userId: user.id,
      })
      return budget
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

export { _delete, create, details, summary, update }
