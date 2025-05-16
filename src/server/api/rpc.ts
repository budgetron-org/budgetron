import { ORPCError, os } from '@orpc/server'
import { connection } from 'next/server'

import { auth } from '~/server/auth'
import type { AwaitedReturnType } from '~/types/shared'

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the headers, the session, etc.
 *
 * This helper generates the "internals" for a RPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 */
async function createRPCContext(options: { headers: Headers }) {
  const session = await auth.api.getSession({ headers: options.headers })
  return { session, ...options }
}

/**
 * 2. INITIALIZATION
 *
 * This is where the RPC API is initialized, connecting the context.
 */
const base = os.$context<AwaitedReturnType<typeof createRPCContext>>()

/**
 * Middleware for making sure that the request is from an authorized user.
 */
const authorizationMiddleware = base.middleware(({ context, next }) => {
  if (!context.session?.session) {
    throw new ORPCError('UNAUTHORIZED')
  }

  return next({
    context: {
      // infers the `session` as non-nullable
      session: { ...context.session },
    },
  })
})

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = base.middleware(async ({ next, path }) => {
  const start = performance.now()

  if (process.env.NODE_ENV === 'development') {
    // artificial delay in dev
    await connection()
    const waitMs = Math.floor(Math.random() * 400) + 100
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }

  const result = await next()

  const end = performance.now()
  console.log(`[RPC] ${path} took ${end - start}ms to execute`)

  return result
})

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your RPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
const publicProcedure = base.use(timingMiddleware)

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `context.session.user` is not null.
 */
const protectedProcedure = base
  .use(timingMiddleware)
  .use(authorizationMiddleware)

export { base, createRPCContext, protectedProcedure, publicProcedure }
