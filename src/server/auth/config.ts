import { type BetterAuthOptions } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { env } from '~/env/server'
import { db } from '~/server/db'
import * as schema from '~/server/db/schema'

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
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      enabled: true,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },

  // Plugins
  plugins: [nextCookies()],
} satisfies BetterAuthOptions
