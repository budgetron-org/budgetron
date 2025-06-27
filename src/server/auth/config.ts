import { type BetterAuthOptions } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { genericOAuth } from 'better-auth/plugins'
import crypto from 'node:crypto'

import { DeleteAccountEmail } from '~/emails/delete-account-email'
import { ResetPasswordEmail } from '~/emails/reset-password-email'
import { env } from '~/env/server'
import {
  getGravatarUrl,
  isGoogleAuthEnabled,
  isOAuthAuthEnabled,
} from '~/lib/utils'
import { db } from '~/server/db'
import * as schema from '~/server/db/schema'
import { sendEmail } from '~/server/email/service'

/**
 * The validity of the password reset token will expire in 15 minutes.
 */
const PASSWORD_RESET_TOKEN_VALIDITY_IN_SECONDS = 15 * 60

/**
 * The validity of the delete account token will expire in 15 minutes.
 */
const DELETE_ACCOUNT_TOKEN_VALIDITY_IN_SECONDS = 15 * 60

/**
 * Options for configuring Better Auth
 *
 * @see https://www.better-auth.com/docs/reference/options
 */
export const authConfig = {
  baseURL: env.AUTH_URL,
  secret: env.AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      // Keys should match the modelName provided below
      accounts: schema.AccountTable,
      sessions: schema.SessionTable,
      users: schema.UserTable,
      verifications: schema.VerificationTable,
    },
  }),

  // Use our own schema
  account: {
    modelName: 'accounts',
    accountLinking: {
      enabled: true,
    },
  },
  session: { modelName: 'sessions' },
  user: {
    modelName: 'users',
    fields: {
      name: 'fullName',
    },
    additionalFields: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      image: { type: 'string', required: false },
      role: {
        type: 'string',
        required: false,
        defaultValue: schema.UserRoleEnum.enumValues[0],
        input: false,
      },
    },
    deleteUser: {
      enabled: true,
      async sendDeleteAccountVerification(data) {
        await sendEmail({
          to: data.user.email,
          subject: 'Your delete account link',
          body: DeleteAccountEmail({
            name: data.user.name,
            deleteAccountUrl: data.url,
            deleteAccountUrlExpiresIn: DELETE_ACCOUNT_TOKEN_VALIDITY_IN_SECONDS,
          }),
        })
      },
    },
  },
  verification: { modelName: 'verifications' },

  advanced: {
    database: {
      // Use DB's uuid() for generating IDs
      generateId: false,
    },
  },

  // Supported auths
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    async sendResetPassword(data) {
      await sendEmail({
        to: data.user.email,
        subject: 'Your password reset link',
        body: ResetPasswordEmail({
          name: data.user.name,
          resetPasswordUrl: data.url,
          resetPasswordUrlExpiresIn: PASSWORD_RESET_TOKEN_VALIDITY_IN_SECONDS,
        }),
      })
    },
    resetPasswordTokenExpiresIn: PASSWORD_RESET_TOKEN_VALIDITY_IN_SECONDS,
  },
  socialProviders: {
    google: isGoogleAuthEnabled(env)
      ? {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          disableImplicitSignUp: true,
          enabled: true,
          prompt: 'select_account',
          mapProfileToUser(profile) {
            return {
              firstName: profile.given_name,
              lastName: profile.family_name,
              image: profile.picture,
              role: schema.UserRoleEnum.enumValues[0],
            }
          },
        }
      : undefined,
  },

  // Plugins
  plugins: [
    nextCookies(),
    isOAuthAuthEnabled(env) &&
      genericOAuth({
        config: [
          {
            providerId: 'custom-oauth-provider',
            clientId: env.OAUTH_CLIENT_ID,
            clientSecret: env.OAUTH_CLIENT_SECRET,
            discoveryUrl: env.OPENID_CONFIGURATION_URL,
            disableImplicitSignUp: true,
            prompt: 'select_account',
            mapProfileToUser(profile) {
              // check if there is given_name and family_name
              // if they both exist, use them
              // check if there is name and split it into first and last
              // check if only given_name exists, and use it as first name
              // check if only family_name exists, and use it as last name
              // if none exist, use the email
              let firstName = ''
              let lastName = ''
              if (profile.given_name && profile.family_name) {
                firstName = profile.given_name
                lastName = profile.family_name
              } else if (profile.name) {
                const nameParts = profile.name.split(' ')
                firstName = nameParts[0]
                lastName = nameParts.slice(1).join(' ')
              } else if (profile.given_name) {
                firstName = profile.given_name
              } else if (profile.family_name) {
                lastName = profile.family_name
              } else {
                firstName = profile.email
              }

              // check if profile has image, picture, or avatar
              let image = profile.image || profile.picture || profile.avatar
              // if not, get one from gravatar
              if (!image && profile.email) {
                // hash the email
                const hash = crypto
                  .createHash('sha256')
                  .update(profile.email)
                  .digest('hex')
                image = getGravatarUrl(hash)
              }

              return {
                firstName,
                lastName,
                id: profile.id,
                name: profile.name,
                email: profile.email,
                emailVerified: profile.email_verified || profile.emailVerified,
                image,
                role: schema.UserRoleEnum.enumValues[0],
              }
            },
          },
        ],
      }),
  ].filter(Boolean),
} satisfies BetterAuthOptions
