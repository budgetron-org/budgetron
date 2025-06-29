import { ORPCError } from '@orpc/client'
import { APIError } from 'better-auth/api'

import { PATHS } from '~/data/routes'
import {
  createRPCErrorFromStatus,
  createRPCErrorFromUnknownError,
} from '~/rpc/utils'
import { protectedProcedure } from '~/server/api/rpc'
import { getAuth } from '~/server/auth'
import { upload } from '~/server/blob/service'
import {
  DeleteAccountInputSchema,
  LinkAccountInputSchema,
  UnlinkAccountInputSchema,
  UpdateInfoInputSchema,
  UpdatePasswordInputSchema,
} from '../validators'
import { deleteAccountFeatureFlag } from '~/server/flags'

const listAccounts = protectedProcedure.handler(async ({ context }) => {
  return getAuth().api.listUserAccounts({ headers: context.headers })
})

const updatePassword = protectedProcedure
  .input(UpdatePasswordInputSchema)
  .handler(async ({ context, input }) => {
    try {
      await getAuth().api.changePassword({
        body: {
          newPassword: input.newPassword,
          currentPassword: input.oldPassword,
        },
        headers: context.headers,
      })
      return { success: true }
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
      const imageUrl =
        typeof input.image === 'string'
          ? input.image
          : input.image instanceof File
            ? (
                await upload({
                  path: `avatars/${context.session.user.id}`,
                  fileName: `profile-picture.${input.image.name.split('.').pop()}`,
                  file: input.image,
                })
              ).url
            : undefined
      await getAuth().api.updateUser({
        body: {
          firstName: input.firstName,
          lastName: input.lastName,
          name: `${input.firstName} ${input.lastName}`,
          image: imageUrl,
        },
        headers: context.headers,
      })
      return { success: true }
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

const deleteAccount = protectedProcedure
  .input(DeleteAccountInputSchema)
  .handler(async ({ context, input }) => {
    try {
      if (!(await deleteAccountFeatureFlag())) {
        throw new ORPCError('FORBIDDEN', {
          message:
            'Delete account feature is not enabled. Please contact support to delete your account.',
        })
      }

      await getAuth().api.deleteUser({
        body: {
          password: input.password,
        },
        headers: context.headers,
      })
      return { success: true }
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

const linkAccount = protectedProcedure
  .input(LinkAccountInputSchema)
  .handler(async ({ context, input }) => {
    const callbackURL = PATHS.ACCOUNT + '?view=security'
    try {
      if (input.providerId === 'google') {
        const response = await getAuth().api.linkSocialAccount({
          body: {
            provider: 'google',
            callbackURL,
          },
          headers: context.headers,
        })
        if (response.redirect) {
          // url is available but a type issue is preventing it from being used
          // See https://github.com/better-auth/better-auth/issues/3198
          return {
            success: true,
            redirectUrl: (response as { url: string }).url,
          }
        }

        return { success: true, redirectUrl: undefined }
      }

      if (input.providerId === 'custom-oauth-provider') {
        const { url } = await getAuth().api.oAuth2LinkAccount({
          body: {
            providerId: 'custom-oauth-provider',
            callbackURL,
          },
          headers: context.headers,
        })
        return { success: true, redirectUrl: url }
      }
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

const unlinkAccount = protectedProcedure
  .input(UnlinkAccountInputSchema)
  .handler(async ({ context, input }) => {
    try {
      const { status } = await getAuth().api.unlinkAccount({
        body: {
          providerId: input.providerId,
        },
        headers: context.headers,
      })
      return { success: status }
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

export {
  deleteAccount,
  linkAccount,
  listAccounts,
  unlinkAccount,
  updateInfo,
  updatePassword,
}
