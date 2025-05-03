import { createRouterClient } from '@orpc/server'
import { headers } from 'next/headers'

import { appRouter } from '~/server/api/router'
import { createRPCContext } from '~/server/api/rpc'

const api = createRouterClient(appRouter, {
  context: async () => {
    return createRPCContext({ headers: await headers() })
  },
})

export { api }
