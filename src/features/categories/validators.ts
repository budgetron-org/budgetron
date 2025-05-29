import { z } from 'zod/v4'
import { TransactionTypes } from '~/server/db/enums'

const GetAllCategoriesInputSchema = z.object({
  groupId: z.string().optional(),
  type: z.enum(TransactionTypes).optional(),
})

const GetAllSubCategoriesInputSchema = GetAllCategoriesInputSchema.extend({})

export { GetAllCategoriesInputSchema, GetAllSubCategoriesInputSchema }
