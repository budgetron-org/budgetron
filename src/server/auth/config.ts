import { type BetterAuthOptions } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { genericOAuth } from 'better-auth/plugins'
import crypto from 'node:crypto'

import { DeleteAccountEmail } from '~/emails/delete-account-email'
import { EmailVerificationEmail } from '~/emails/email-verification-email'
import { ResetPasswordEmail } from '~/emails/reset-password-email'
import WelcomeEmail from '~/emails/welcome-email'
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
 * The validity of the email verification token will expire in 15 minutes.
 */
const EMAIL_VERIFICATION_TOKEN_VALIDITY_IN_SECONDS = 15 * 60

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
      allowDifferentEmails: true,
      enabled: true,
    },
  },
  session: { modelName: 'sessions' },
  user: {
    modelName: 'users',
    additionalFields: {
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
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail(data) {
      await sendEmail({
        to: data.user.email,
        subject: 'Your email verification link',
        body: EmailVerificationEmail({
          name: data.user.name,
          emailVerificationUrl: data.url,
          emailVerificationUrlExpiresIn:
            EMAIL_VERIFICATION_TOKEN_VALIDITY_IN_SECONDS,
        }),
      })
    },
    expiresIn: EMAIL_VERIFICATION_TOKEN_VALIDITY_IN_SECONDS,
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
              image: profile.picture,
              role: schema.UserRoleEnum.enumValues[0],
            }
          },
        }
      : undefined,
  },

  databaseHooks: {
    user: {
      create: {
        async after(user) {
          // send welcome email after a user is created
          await sendEmail({
            to: user.email,
            subject: 'Welcome to Budgetron!',
            body: WelcomeEmail({
              name: user.name,
              appUrl: env.AUTH_URL,
            }),
          })
        },
      },
    },
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
              let image = profile.image || profile.picture || profile.avatar
              if (!image && profile.email) {
                const hash = crypto
                  .createHash('sha256')
                  .update(profile.email)
                  .digest('hex')
                image = getGravatarUrl(hash)
              }

              return {
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
