import { z } from 'zod/v4'
import { PasswordPolicy } from '~/server/auth/policies'

const UpdateInfoInputSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  image: z.instanceof(File).optional(),
})
const ProfileFormSchema = UpdateInfoInputSchema.pick({
  firstName: true,
  lastName: true,
  image: true,
}).extend({
  email: z.email(),
})

const UpdatePasswordInputSchema = z.object({
  oldPassword: z.string().nonempty(),
  newPassword: PasswordPolicy,
})
const SecurityFormSchema = UpdatePasswordInputSchema.extend({
  confirmPassword: z.string().nonempty(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  error: 'Passwords do not match.',
  path: ['confirmPassword'],
})

export {
  ProfileFormSchema,
  SecurityFormSchema,
  UpdateInfoInputSchema,
  UpdatePasswordInputSchema,
}
