import { redirect } from 'next/navigation'
import { PATHS } from '~/data/routes'
import { api } from '~/rpc/server'

function redirectToSignIn(): never {
  redirect(PATHS.SIGN_IN)
}

async function redirectUnauthenticated() {
  const session = await api.auth.session()

  if (!session?.user) redirectToSignIn()
}

async function redirectAuthenticated() {
  const session = await api.auth.session()

  if (session?.user) redirect(PATHS.DASHBOARD)
}

export { redirectAuthenticated, redirectToSignIn, redirectUnauthenticated }
