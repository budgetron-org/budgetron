import { onError, ORPCError, ValidationError } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'
import { CORSPlugin } from '@orpc/server/plugins'
import { z, ZodError } from 'zod/v4'

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
  clientInterceptors: [
    onError((error) => {
      // Handle input validation errors
      if (
        error instanceof ORPCError &&
        error.code === 'BAD_REQUEST' &&
        error.cause instanceof ValidationError
      ) {
        // we only use zod for input validation
        const zodError = new ZodError(error.cause.issues as z.core.$ZodIssue[])
        throw new ORPCError('INPUT_VALIDATION_FAILED', {
          status: 422,
          message: z.prettifyError(zodError), // use zod error message for more client side details
        })
      }
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
