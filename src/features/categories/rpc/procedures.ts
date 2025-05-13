import { createRPCErrorFromUnknownError } from '~/rpc/utils'
import { protectedProcedure } from '~/server/api/rpc'
import { findAllCategories, findAllSubCategories } from '../service'
import {
  GetAllCategoriesInputSchema,
  GetAllSubCategoriesInputSchema,
} from '../validators'

const getAll = protectedProcedure
  .input(GetAllCategoriesInputSchema)
  .handler(async ({ context, input }) => {
    const session = context.session
    try {
      const categories = await findAllCategories({
        userId: session.user.id,
        groupId: input.groupId,
        type: input.type,
      })
      return categories
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

const getAllSubCategories = protectedProcedure
  .input(GetAllSubCategoriesInputSchema)
  .handler(async ({ context, input }) => {
    const session = context.session
    try {
      const categories = await findAllSubCategories({
        userId: session.user.id,
        groupId: input.groupId,
        type: input.type,
      })
      return categories
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

export { getAll, getAllSubCategories }
