import { redirect } from 'next/navigation'

import { api, HydrateClient } from '~/trpc/server'
import { SignInForm } from '../_components/sign-in-form'

export default async function SignInPage() {
  // Redirect to home if already signed in
  const session = await api.auth.getSession()
  if (session?.user) redirect('/dashboard')

  return (
    <HydrateClient>
      <SignInForm />
    </HydrateClient>
  )
}
