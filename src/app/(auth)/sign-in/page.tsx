import { redirect } from 'next/navigation'

import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { SignInForm } from '~/features/auth/components/sign-in-form'
import { SignInWithGoogle } from '~/features/auth/components/sign-in-with-google'
import { api } from '~/rpc/server'
import { signupFeatureFlag } from '~/server/flags'

async function SignInPageImpl() {
  // Redirect to home if already signed in
  const session = await api.auth.session()
  if (session?.user) redirect('/dashboard')

  // Show auth providers only if signup is allowed
  const signupAllowed = await signupFeatureFlag()

  return (
    <SignInForm
      redirectAfterSignIn="/dashboard"
      providers={[
        <SignInWithGoogle key="google" requestSignUp={signupAllowed} />,
      ]}
    />
  )
}

export default async function SignInPage() {
  return (
    <SuspenseBoundary fullScreenFallback>
      <SignInPageImpl />
    </SuspenseBoundary>
  )
}
