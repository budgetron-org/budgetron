import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { BatchLinkPlugin } from '@orpc/client/plugins'
import { createORPCReactQueryUtils } from '@orpc/react-query'
import type {
  InferRouterInputs,
  InferRouterOutputs,
  RouterClient,
} from '@orpc/server'

import { env } from '~/env/shared'
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
  if (typeof window === 'undefined') {
    throw new Error('getBaseUrl can only be called on the client side')
  }
  return `${window.location.origin}${env.NEXT_PUBLIC_BASE_PATH ?? ''}`
}

const client = createORPCClient<RouterClient<AppRouter>>(
  new RPCLink<ClientContext>({
    url: () => {
      // This should only be called on the client side
      return getBaseUrl() + '/api/rpc'
    },
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

/**
 * The ORPC client specific for using with React Query. This is used to call useQuery and useMutation hooks
 * from the client side.
 */
const api = createORPCReactQueryUtils(client)

export { api }
export type { RouterInputs, RouterOutputs }
