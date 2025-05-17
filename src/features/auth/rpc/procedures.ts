import { ORPCError } from '@orpc/client'
import { APIError } from 'better-auth/api'

import {
  createRPCErrorFromStatus,
  createRPCErrorFromUnknownError,
} from '~/rpc/utils'
import { publicProcedure } from '~/server/api/rpc'
import { auth } from '~/server/auth'
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  SignInSchema,
  SignUpSchema,
} from '../validators'

const signIn = publicProcedure
  .input(SignInSchema)
  .handler(async ({ context, input }) => {
    try {
      await auth.api.signInEmail({
        body: input,
        headers: context.headers,
      })
      return { success: true, redirect: '/dashboard' }
    } catch (error) {
      if (error instanceof APIError) {
        if (typeof error.status === 'string') {
          throw new ORPCError(error.status, {
            message: error.message,
            cause: error.cause,
          })
        }
        throw createRPCErrorFromStatus(error.status, error.message, error.cause)
      }
      throw createRPCErrorFromUnknownError(error)
    }
  })

const signUp = publicProcedure
  .input(SignUpSchema)
  .handler(async ({ context, input }) => {
    const { email, firstName, lastName, password } = input
    try {
      await auth.api.signUpEmail({
        body: {
          email,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          password,
        },
        headers: context.headers,
      })
      return { success: true, redirect: '/dashboard' }
    } catch (error) {
      if (error instanceof APIError) {
        if (typeof error.status === 'string') {
          throw new ORPCError(error.status, {
            message: error.message,
            cause: error.cause,
          })
        }
        throw createRPCErrorFromStatus(error.status, error.message, error.cause)
      }
      throw createRPCErrorFromUnknownError(error)
    }
  })

const signOut = publicProcedure.handler(async ({ context }) => {
  try {
    await auth.api.signOut({
      headers: context.headers,
    })
    return { success: true, redirect: '/' }
  } catch (error) {
    if (error instanceof APIError) {
      if (typeof error.status === 'string') {
        throw new ORPCError(error.status, {
          message: error.message,
          cause: error.cause,
        })
      }
      throw createRPCErrorFromStatus(error.status, error.message, error.cause)
    }
    throw createRPCErrorFromUnknownError(error)
  }
})

const session = publicProcedure.handler(async ({ context }) => {
  return auth.api.getSession({ headers: context.headers })
})

const forgotPassword = publicProcedure
  .input(ForgotPasswordSchema)
  .handler(async ({ context, input }) => {
    try {
      const { status } = await auth.api.forgetPassword({
        body: { email: input.email, redirectTo: '/reset-password' },
        headers: context.headers,
      })
      return { success: status }
    } catch (error) {
      if (error instanceof APIError) {
        if (typeof error.status === 'string') {
          throw new ORPCError(error.status, {
            message: error.message,
            cause: error.cause,
          })
        }
        throw createRPCErrorFromStatus(error.status, error.message, error.cause)
      }
      throw createRPCErrorFromUnknownError(error)
    }
  })

const resetPassword = publicProcedure
  .input(ResetPasswordSchema)
  .handler(async ({ context, input }) => {
    try {
      const { status } = await auth.api.resetPassword({
        body: {
          newPassword: input.password,
          token: input.token,
        },
        headers: context.headers,
      })
      return { success: status }
    } catch (error) {
      if (error instanceof APIError) {
        if (typeof error.status === 'string') {
          throw new ORPCError(error.status, {
            message: error.message,
            cause: error.cause,
          })
        }
        throw createRPCErrorFromStatus(error.status, error.message, error.cause)
      }
      throw createRPCErrorFromUnknownError(error)
    }
  })

export { forgotPassword, resetPassword, session, signIn, signOut, signUp }
