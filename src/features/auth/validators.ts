import { z } from 'zod'
import { PasswordPolicy } from '~/server/auth/policies'

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const SignInWithSocialSchema = z.object({
  // TODO: Add more providers as we add support for them
  provider: z.enum(['google']),
  callbackURL: z.string().url().optional(),
})

const SignUpSchema = z
  .object({
    firstName: z.string().min(1, 'First Name is required.'),
    lastName: z.string().min(1, 'Last Name is required.'),
    email: z.string().email('Enter a valid email address'),
    password: PasswordPolicy,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
})

const ResetPasswordSchema = z
  .object({
    password: PasswordPolicy,
    confirmPassword: z.string(),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  SignInSchema,
  SignInWithSocialSchema,
  SignUpSchema,
}
