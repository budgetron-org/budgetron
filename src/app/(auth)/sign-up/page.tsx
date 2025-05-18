import { redirect } from 'next/navigation'

import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { SignInWithGoogle } from '~/features/auth/components/sign-in-with-google'
import { SignUpForm } from '~/features/auth/components/sign-up-form'
import { SignUpRestrictedPage } from '~/features/auth/components/sign-up-restricted-page'
import { api } from '~/rpc/server'
import { signupFeatureFlag } from '~/server/flags'

async function SignUpPageImpl() {
  // Redirect to home if already signed in
  const session = await api.auth.session()
  if (session?.user) redirect('/dashboard')

  // check to see if signup is allowed
  const signupAllowed = await signupFeatureFlag()
  if (!signupAllowed) {
    return <SignUpRestrictedPage />
  }

  return (
    <SignUpForm
      redirectAfterSignUp="/dashboard"
      providers={[<SignInWithGoogle key="google" />]}
    />
  )
}

export default async function SignUpPage() {
  return (
    <SuspenseBoundary fullScreenFallback>
      <SignUpPageImpl />
    </SuspenseBoundary>
  )
}
