import { redirect } from 'next/navigation'
import { api } from '~/rpc/server'

async function redirectUnauthenticated() {
  const session = await api.auth.session()

  if (!session?.user) redirect('/sign-in')
}

export { redirectUnauthenticated }
