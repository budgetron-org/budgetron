import { createEnv } from '@t3-oss/env-nextjs'

const env = createEnv({
  emptyStringAsUndefined: true,
  client: {},
  experimental__runtimeEnv: {},
})

export { env }
