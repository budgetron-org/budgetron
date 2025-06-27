import { z } from 'zod/v4'
import { PasswordPolicy } from '~/server/auth/policies'

const SignInSchema = z.object({
  email: z.email(),
  password: z.string(),
})

const SignInWithSocialSchema = z.object({
  // TODO: Add more providers as we add support for them
  provider: z.enum(['google']),
  callbackURL: z.url().optional(),
})

const SignInWithOauthSchema = z.object({
  providerId: z.enum(['custom-oauth-provider']),
  callbackURL: z.url().optional(),
})

const SignUpSchema = z
  .object({
    firstName: z.string().min(1, { error: 'First Name is required.' }),
    lastName: z.string().min(1, { error: 'Last Name is required.' }),
    email: z.email({ error: 'Enter a valid email address' }),
    password: PasswordPolicy,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

const ForgotPasswordSchema = z.object({
  email: z.email(),
})

const ResetPasswordSchema = z
  .object({
    password: PasswordPolicy,
    confirmPassword: z.string(),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  SignInSchema,
  SignInWithOauthSchema,
  SignInWithSocialSchema,
  SignUpSchema,
}
