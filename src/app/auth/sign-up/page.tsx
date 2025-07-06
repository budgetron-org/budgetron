import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { PATHS } from '~/data/routes'
import { env } from '~/env/server'
import { SignInWithGoogle } from '~/features/auth/components/sign-in-with-google'
import { SignInWithOAuth } from '~/features/auth/components/sign-in-with-oauth'
import { SignUpForm } from '~/features/auth/components/sign-up-form'
import { SignUpRestrictedPage } from '~/features/auth/components/sign-up-restricted-page'
import { redirectAuthenticated } from '~/features/auth/utils'
import { isGoogleAuthEnabled, isOAuthAuthEnabled } from '~/lib/utils'
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
      providers={[
        isGoogleAuthEnabled(env) && <SignInWithGoogle key="google" />,
        isOAuthAuthEnabled(env) && (
          <SignInWithOAuth key="oauth" providerName={env.OAUTH_PROVIDER_NAME} />
        ),
      ].filter(Boolean)}
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
