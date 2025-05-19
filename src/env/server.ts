import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

console.log('CI: ', process.env.CI)
console.log('Skip Validations: ', process.env.CI === 'true')

const env = createEnv({
  emptyStringAsUndefined: true,
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),

    AUTH_SECRET: z.string().min(1),
    AUTH_URL: z.string().url(),

    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    DB_URL: z.string().url(),

    OLLAMA_URL: z.string().url(),
    OLLAMA_MODEL: z.string().min(1), // TODO: Add enum with supported models?

    EMAIL_PROVIDER_API_KEY: z.string().min(1),
    EMAIL_PROVIDER_FROM_EMAIL: z.string().min(1),

    BLOB_READ_WRITE_TOKEN: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
  // Skip build time validation when running on CI as the env variables are not available
  // during the build process.
  skipValidation: process.env.CI === 'true',
})

export { env }
