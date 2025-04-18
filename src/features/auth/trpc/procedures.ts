import { TRPCError } from '@trpc/server'
import { APIError } from 'better-auth/api'

import { publicProcedure } from '~/server/api/trpc'
import { auth } from '~/server/auth'
import { SignInSchema, SignUpSchema } from '../validators'

const signIn = publicProcedure
  .input(SignInSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      await auth.api.signInEmail({
        body: input,
        headers: ctx.headers,
      })
    } catch (error) {
      if (error instanceof APIError) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: error.message,
        })
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unknown Error: Please try again',
      })
    }

    return { success: true, redirect: '/dashboard' }
  })

const signUp = publicProcedure
  .input(SignUpSchema)
  .mutation(async ({ input, ctx }) => {
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
        headers: ctx.headers,
      })
    } catch (error) {
      if (error instanceof APIError) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: error.message,
        })
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unknown Error: Please try again',
      })
    }
    return { success: true, redirect: '/dashboard' }
  })

const getSession = publicProcedure.query(async ({ ctx }) => {
  return auth.api.getSession({ headers: ctx.headers })
})

export { getSession, signIn, signUp }
