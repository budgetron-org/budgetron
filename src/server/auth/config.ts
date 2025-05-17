import { type BetterAuthOptions } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'

import ResetPasswordEmail from '~/emails/reset-password-email'
import { env } from '~/env/server'
import { db } from '~/server/db'
import * as schema from '~/server/db/schema'
import { sendEmail } from '~/server/email/service'

/**
 * The validity of the password reset token will expire in 15 minutes.
 */
const PASSWORD_RESET_TOKEN_VALIDITY_IN_SECONDS = 15 * 60

/**
 * Options for configuring Better Auth
 *
 * @see https://www.better-auth.com/docs/reference/options
 */
export const authConfig = {
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
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
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
    },
  },

  // Plugins
  plugins: [nextCookies()],
} satisfies BetterAuthOptions
