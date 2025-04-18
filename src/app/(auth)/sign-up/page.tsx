import { redirect } from 'next/navigation'

import { api, HydrateClient } from '~/trpc/server'
import { SignUpForm } from '../_components/sign-up-form'

export default async function SignInPage() {
  // Redirect to home if already signed in
  const session = await api.auth.getSession()
  if (session?.user) redirect('/dashboard')

  return (
    <HydrateClient>
      <SignUpForm />
    </HydrateClient>
  )
}
