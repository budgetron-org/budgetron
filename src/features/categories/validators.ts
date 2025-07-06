import { z } from 'zod/v4'
import { TransactionTypeEnum } from '~/server/db/schema'

const GetAllCategoriesInputSchema = z.object({
  groupId: z.string().optional(),
  type: z.enum(TransactionTypeEnum.enumValues).optional(),
})

const GetAllSubCategoriesInputSchema = GetAllCategoriesInputSchema.extend({})

export { GetAllCategoriesInputSchema, GetAllSubCategoriesInputSchema }
