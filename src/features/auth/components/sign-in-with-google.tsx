'use client'

import { useCallback } from 'react'

import { GoogleIcon } from '~/components/icons'
import { Button } from '~/components/ui/button'
import { authClient } from '~/features/auth/client'

interface SignInWithGoogleProps {
  requestSignUp?: boolean
}
function SignInWithGoogle({ requestSignUp }: SignInWithGoogleProps) {
  const doGoogleSignIn = useCallback(() => {
    authClient.signIn.social({
      provider: 'google',
      requestSignUp,
    })
  }, [requestSignUp])
  return (
    <Button variant="outline" className="w-full" onClick={doGoogleSignIn}>
      <GoogleIcon />
      Sign in with Google
    </Button>
  )
}

export { SignInWithGoogle }
