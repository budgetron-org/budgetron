import { z } from 'zod'
import { PasswordPolicy } from '~/server/auth/policies'

const UpdateInfoInputSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  image: z.instanceof(File).optional(),
})
const ProfileFormSchema = UpdateInfoInputSchema.pick({
  firstName: true,
  lastName: true,
  image: true,
}).extend({
  email: z.string().email(),
})

const UpdatePasswordInputSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: PasswordPolicy,
})
const SecurityFormSchema = UpdatePasswordInputSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
})

export {
  ProfileFormSchema,
  SecurityFormSchema,
  UpdateInfoInputSchema,
  UpdatePasswordInputSchema,
}
