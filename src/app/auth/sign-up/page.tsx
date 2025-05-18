import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { PATHS } from '~/data/routes'
import { SignInWithGoogle } from '~/features/auth/components/sign-in-with-google'
import { SignUpForm } from '~/features/auth/components/sign-up-form'
import { SignUpRestrictedPage } from '~/features/auth/components/sign-up-restricted-page'
import { redirectAuthenticated } from '~/features/auth/server'
import { signupFeatureFlag } from '~/server/flags'

async function SignUpPageImpl() {
  // Redirect to home if already signed in
  await redirectAuthenticated()

  // check to see if signup is allowed
  const signupAllowed = await signupFeatureFlag()
  if (!signupAllowed) {
    return <SignUpRestrictedPage />
  }

  return (
    <SignUpForm
      redirectAfterSignUp={PATHS.DASHBOARD}
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
