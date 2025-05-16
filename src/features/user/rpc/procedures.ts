import { ORPCError } from '@orpc/client'
import { APIError } from 'better-auth/api'

import {
  createRPCErrorFromStatus,
  createRPCErrorFromUnknownError,
} from '~/rpc/utils'
import { protectedProcedure } from '~/server/api/rpc'
import { auth } from '~/server/auth'
import { UpdateInfoInputSchema, UpdatePasswordInputSchema } from '../validators'
import { upload } from '~/server/blob/service'

const listAccounts = protectedProcedure.handler(async ({ context }) => {
  return auth.api.listUserAccounts({ headers: context.headers })
})

const updatePassword = protectedProcedure
  .input(UpdatePasswordInputSchema)
  .handler(async ({ context, input }) => {
    try {
      await auth.api.changePassword({
        body: {
          newPassword: input.newPassword,
          currentPassword: input.oldPassword,
        },
        headers: context.headers,
      })
      return { success: true, redirect: '/dashboard' }
    } catch (error) {
      if (error instanceof APIError) {
        if (typeof error.status === 'string') {
          throw new ORPCError(error.status, {
            status: error.statusCode,
            message: error.message,
            cause: error.cause,
          })
        }
        throw createRPCErrorFromStatus(error.status, error.message, error.cause)
      }
      throw createRPCErrorFromUnknownError(error)
    }
  })

const updateInfo = protectedProcedure
  .input(UpdateInfoInputSchema)
  .handler(async ({ context, input }) => {
    try {
      let imageUrl: string | undefined
      if (input.image) {
        const { url } = await upload({
          path: `avatars/${context.session.user.id}`,
          fileName: `profile-picture.${input.image.name.split('.').pop()}`,
          file: input.image,
        })
        imageUrl = url
      }
      await auth.api.updateUser({
        body: {
          firstName: input.firstName,
          lastName: input.lastName,
          name: `${input.firstName} ${input.lastName}`,
          image: imageUrl,
        },
        headers: context.headers,
      })
      return { success: true, redirect: '/dashboard' }
    } catch (error) {
      if (error instanceof APIError) {
        if (typeof error.status === 'string') {
          throw new ORPCError(error.status, {
            status: error.statusCode,
            message: error.message,
            cause: error.cause,
          })
        }
        throw createRPCErrorFromStatus(error.status, error.message, error.cause)
      }
      throw createRPCErrorFromUnknownError(error)
    }
  })

export { listAccounts, updateInfo, updatePassword }
