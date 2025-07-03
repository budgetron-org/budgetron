import { z } from 'zod/v4'
import { PasswordPolicy } from '~/server/auth/policies'

const UpdateInfoInputSchema = z.object({
  name: z.string().nonempty(),
  image: z.union([z.instanceof(File), z.string()]).optional(),
})
const ProfileFormSchema = UpdateInfoInputSchema.pick({
  name: true,
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

const DeleteAccountInputSchema = z.object({
  password: z.string().optional(),
})
// The form schema is only used when the account has email-password credentials
// in which case, the password is required
const DeleteAccountFormSchema = z.object({
  password: z.string().nonempty({
    error: 'Password is required.',
  }),
})

const LinkAccountInputSchema = z.object({
  providerId: z.enum(['google', 'custom-oauth-provider']),
})

const UnlinkAccountInputSchema = z.object({
  providerId: z.enum(['google', 'custom-oauth-provider']),
})

export {
  DeleteAccountFormSchema,
  DeleteAccountInputSchema,
  LinkAccountInputSchema,
  ProfileFormSchema,
  SecurityFormSchema,
  UnlinkAccountInputSchema,
  UpdateInfoInputSchema,
  UpdatePasswordInputSchema,
}
