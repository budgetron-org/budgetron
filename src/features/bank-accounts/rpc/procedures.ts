import { createRPCErrorFromUnknownError } from '~/rpc/utils'
import { protectedProcedure } from '~/server/api/rpc'
import {
  deleteBankAccount,
  findAllBankAccounts,
  insertBankAccount,
  updateBankAccount,
} from '../service'
import {
  CreateBankAccountInputSchema,
  DeleteBankAccountInputSchema,
  UpdateBankAccountInputSchema,
} from '../validators'

const create = protectedProcedure
  .input(CreateBankAccountInputSchema)
  .handler(async ({ context, input }) => {
    const session = context.session

    try {
      const bankAccount = await insertBankAccount({
        name: input.name,
        type: input.type,
        balance: input.balance,
        currency: input.currency,
        userId: session.user.id,
      })
      return bankAccount
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

const _delete = protectedProcedure
  .input(DeleteBankAccountInputSchema)
  .handler(async ({ context, input }) => {
    const session = context.session

    try {
      const bankAccount = await deleteBankAccount({
        id: input.id,
        userId: session.user.id,
      })
      return bankAccount
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

const getAll = protectedProcedure.handler(async ({ context }) => {
  const session = context.session

  try {
    const bankAccounts = await findAllBankAccounts({
      userId: session.user.id,
    })
    return bankAccounts
  } catch (error) {
    throw createRPCErrorFromUnknownError(error)
  }
})

const update = protectedProcedure
  .input(UpdateBankAccountInputSchema)
  .handler(async ({ context, input }) => {
    const session = context.session

    try {
      const bankAccount = await updateBankAccount({
        name: input.name,
        type: input.type,
        balance: input.balance,
        id: input.id,
        userId: session.user.id,
      })
      return bankAccount
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

export { create, getAll, _delete, update }
