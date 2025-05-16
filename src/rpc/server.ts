import 'server-only'

import { createRouterClient } from '@orpc/server'
import { headers } from 'next/headers'

import { appRouter } from '~/server/api/router'
import { createRPCContext } from '~/server/api/rpc'

/**
 * The ORPC client specific for using with NextJS server. This should only be used
 * to make RPC calls on the server side. Calling procedures with this API will call them
 * as simple functions instead of making HTTP requests.
 */
const api = createRouterClient(appRouter, {
  context: async () => {
    return createRPCContext({ headers: await headers() })
  },
})

export { api }
