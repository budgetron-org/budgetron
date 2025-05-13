import { z } from 'zod'

const AccountFormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  image: z.string().optional(),
})

export { AccountFormSchema }
