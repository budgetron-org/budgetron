import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  emptyStringAsUndefined: true,
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),

    BASE_PATH: z.string().optional(),

    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    DB_HOST: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_NAME: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
})
