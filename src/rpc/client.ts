import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { BatchLinkPlugin } from '@orpc/client/plugins'
import { createORPCReactQueryUtils } from '@orpc/react-query'
import type {
  InferRouterInputs,
  InferRouterOutputs,
  RouterClient,
} from '@orpc/server'

import type { AppRouter } from '~/server/api/router'

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
type RouterInputs = InferRouterInputs<AppRouter>

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
type RouterOutputs = InferRouterOutputs<AppRouter>

type ClientContext = {
  skipBatch?: boolean
}

function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

const client = createORPCClient<RouterClient<AppRouter>>(
  new RPCLink<ClientContext>({
    url: getBaseUrl() + '/api/rpc',
    plugins: [
      new BatchLinkPlugin({
        groups: [
          {
            condition: (options) => Boolean(options.context['skipBatch']),
            context: {},
          },
        ],
        exclude: (options) => Boolean(options.context.skipBatch),
      }),
    ],
  }),
)

const api = createORPCReactQueryUtils(client)

export { api }
export type { RouterInputs, RouterOutputs }
