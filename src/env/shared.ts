import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const env = createEnv({
  emptyStringAsUndefined: true,
  shared: {
    NEXT_PUBLIC_BASE_PATH: z.string().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
  },
})

export { env }
