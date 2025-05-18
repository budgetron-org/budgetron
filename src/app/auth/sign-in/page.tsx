import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { PATHS } from '~/data/routes'
import { SignInForm } from '~/features/auth/components/sign-in-form'
import { SignInWithGoogle } from '~/features/auth/components/sign-in-with-google'
import { redirectAuthenticated } from '~/features/auth/server'
import { signupFeatureFlag } from '~/server/flags'

async function SignInPageImpl() {
  // Redirect to home if already signed in
  redirectAuthenticated()

  // Show auth providers only if signup is allowed
  const signupAllowed = await signupFeatureFlag()

  return (
    <SignInForm
      redirectAfterSignIn={PATHS.DASHBOARD}
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
