import { z } from 'zod'

/**
 * New password policy for users.
 */
const PasswordPolicy = z
  .string()
  .min(8, 'Password should be atleast 8 characters.')
  .max(16, 'Password should be less than 16 characters.')
  .refine(
    (password) => /[A-Z]/.test(password),
    'Password should contain atleast one uppercase.',
  )
  .refine(
    (password) => /[a-z]/.test(password),
    'Password should contain atleast one lowercase.',
  )
  .refine(
    (password) => /[0-9]/.test(password),
    'Password should contain atleast one number.',
  )
  .refine(
    (password) => /[!@#$%^&*]/.test(password),
    'Password should contain atleast one special character: !@#$%^&*',
  )

export { PasswordPolicy }
