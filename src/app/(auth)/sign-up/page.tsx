import { redirect } from 'next/navigation'

import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { SignUpForm } from '~/features/auth/components/sign-up-form'
import { api } from '~/rpc/server'

async function SignUpPageImpl() {
  // Redirect to home if already signed in
  const session = await api.auth.session()
  if (session?.user) redirect('/dashboard')

  return <SignUpForm />
}

export default async function SignUpPage() {
  return (
    <SuspenseBoundary>
      <SignUpPageImpl />
    </SuspenseBoundary>
  )
}
