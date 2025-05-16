import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const env = createEnv({
  emptyStringAsUndefined: true,
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),

    BASE_PATH: z.string().optional(),

    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    DB_URL: z.string().url(),

    OLLAMA_URL: z.string().url(),
    OLLAMA_MODEL: z.string().min(1), // TODO: Add enum with supported models?
  },
  experimental__runtimeEnv: process.env,
})

export { env }
