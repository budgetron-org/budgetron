import { redirect } from 'next/navigation'
import { api } from '~/rpc/server'

function redirectToSignIn(): never {
  redirect('/sign-in')
}

async function redirectUnauthenticated() {
  const session = await api.auth.session()

  if (!session?.user) redirectToSignIn()
}

export { redirectToSignIn, redirectUnauthenticated }
