import { onError } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'
import { CORSPlugin } from '@orpc/server/plugins'

import { env } from '~/env/server'
import { appRouter } from '~/server/api/router'
import { createRPCContext } from '~/server/api/rpc'

const handler = new RPCHandler(appRouter, {
  plugins: [new CORSPlugin({ allowMethods: ['GET', 'POST'] })],
  interceptors: [
    onError((error) => {
      if (env.NODE_ENV === 'development') console.error(error)
    }),
  ],
})

async function handleRequest(request: Request) {
  const { matched, response } = await handler.handle(request, {
    prefix: '/api/rpc',
    context: await createRPCContext({ headers: request.headers }),
  })

  if (matched) return response
  return new Response('Not found', { status: 404 })
}

export { handleRequest as GET, handleRequest as POST }
