import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { SignUpForm } from '~/features/auth/components/sign-up-form'
import { api, HydrateClient } from '~/trpc/server'

async function SignUpPageImpl() {
  // Redirect to home if already signed in
  const session = await api.auth.getSession()
  if (session?.user) redirect('/dashboard')

  return (
    <HydrateClient>
      <SignUpForm />
    </HydrateClient>
  )
}

export default async function SignUpPage() {
  return (
    <Suspense>
      <SignUpPageImpl />
    </Suspense>
  )
}
