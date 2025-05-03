import { authRouter } from '~/features/auth/rpc/router'
import { bankAccountsRouter } from '~/features/bank-accounts/rpc/router'
import { categoriesRouter } from '~/features/categories/rpc/router'
import { dashboardRouter } from '~/features/dashboard/rpc/router'
import { transactionsRouter } from '~/features/transactions/rpc/router'
import { base } from './rpc'

/**
 * This is the primary router for the server.
 *
 * All routers added in /features should be manually added here.
 */
const appRouter = base.router({
  auth: authRouter,
  bankAccounts: bankAccountsRouter,
  categories: categoriesRouter,
  dashboard: dashboardRouter,
  transactions: transactionsRouter,
})

/**
 * Type definition of the RPC router
 */
type AppRouter = typeof appRouter

export { appRouter }
export type { AppRouter }
