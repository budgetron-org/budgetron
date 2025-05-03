import { createRPCErrorFromUnknownError } from '~/rpc/utils'
import { protectedProcedure } from '~/server/api/rpc'
import { findAllCategories } from '../service'
import { GetAllCategoriesInputSchema } from '../validators'

const getAll = protectedProcedure
  .input(GetAllCategoriesInputSchema)
  .handler(async ({ context, input }) => {
    const session = context.session
    try {
      const categories = await findAllCategories({
        userId: session.user.id,
        groupId: input.groupId,
      })
      return categories
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

export { getAll }
