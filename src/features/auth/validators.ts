import { z } from 'zod'

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const SignUpSchema = z
  .object({
    firstName: z.string().min(1, 'First Name is required.'),
    lastName: z.string().min(1, 'Last Name is required.'),
    email: z.string().email('Enter a valid email address'),
    password: z
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
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export { SignInSchema, SignUpSchema }
