import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod/v4'

const env = createEnv({
  emptyStringAsUndefined: true,
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),

    AUTH_SECRET: z.string().nonempty(),
    AUTH_URL: z.url(),

    GOOGLE_CLIENT_ID: z.string().nonempty().optional(),
    GOOGLE_CLIENT_SECRET: z.string().nonempty().optional(),

    OAUTH_CLIENT_ID: z.string().nonempty().optional(),
    OAUTH_CLIENT_SECRET: z.string().nonempty().optional(),
    OAUTH_PROVIDER_NAME: z.string().nonempty().optional(),
    OPENID_CONFIGURATION_URL: z.url().optional(),

    DB_URL: z.url(),

    OPENAI_COMPATIBLE_PROVIDER: z.string().nonempty().optional(),
    OPENAI_COMPATIBLE_BASE_URL: z.url().optional(),
    OPENAI_COMPATIBLE_API_KEY: z.string().nonempty().optional(),
    OPENAI_COMPATIBLE_MODEL: z.string().nonempty().optional(),

    EMAIL_PROVIDER_API_KEY: z.string().nonempty().optional(),
    EMAIL_PROVIDER_FROM_EMAIL: z.string().nonempty().optional(),

    BLOB_READ_WRITE_TOKEN: z.string().nonempty().optional(),
  },
  experimental__runtimeEnv: process.env,
  // Skip build time validation when running on CI or docker build as the env variables are not available
  // during the build process.
  skipValidation: process.env.CI === 'true' || process.env.DOCKER === 'true',
})

export { env }
