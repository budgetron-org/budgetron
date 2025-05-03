import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { SignInForm } from '~/features/auth/components/sign-in-form'
import { api } from '~/rpc/server'

async function SignInPageImpl() {
  // Redirect to home if already signed in
  const session = await api.auth.session()
  if (session?.user) redirect('/dashboard')

  return <SignInForm />
}

export default async function SignInPage() {
  return (
    <Suspense>
      <SignInPageImpl />
    </Suspense>
  )
}
