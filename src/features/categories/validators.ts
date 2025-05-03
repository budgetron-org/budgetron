import { z } from 'zod'

const GetAllCategoriesInputSchema = z.object({
  groupId: z.string().optional(),
})

export { GetAllCategoriesInputSchema }
