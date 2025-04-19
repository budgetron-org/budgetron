import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { SignInForm } from '~/features/auth/components/sign-in-form'
import { api, HydrateClient } from '~/trpc/server'

async function SignInPageImpl() {
  // Redirect to home if already signed in
  const session = await api.auth.getSession()
  if (session?.user) redirect('/dashboard')

  return (
    <HydrateClient>
      <SignInForm />
    </HydrateClient>
  )
}

export default async function SignInPage() {
  return (
    <Suspense>
      <SignInPageImpl />
    </Suspense>
  )
}
