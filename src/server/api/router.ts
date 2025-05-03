import { analyticsRouter } from '~/features/analytics/rpc/router'
import { authRouter } from '~/features/auth/rpc/router'
import { bankAccountsRouter } from '~/features/bank-accounts/rpc/router'
import { categoriesRouter } from '~/features/categories/rpc/router'
import { transactionsRouter } from '~/features/transactions/rpc/router'
import { base } from './rpc'

/**
 * This is the primary router for the server.
 *
 * All routers added in /features should be manually added here.
 */
const appRouter = base.router({
  analytics: analyticsRouter,
  auth: authRouter,
  bankAccounts: bankAccountsRouter,
  categories: categoriesRouter,
  transactions: transactionsRouter,
})

/**
 * Type definition of the RPC router
 */
type AppRouter = typeof appRouter

export { appRouter }
export type { AppRouter }
