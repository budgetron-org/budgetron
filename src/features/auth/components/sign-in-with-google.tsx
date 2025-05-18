'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { GoogleIcon } from '~/components/icons'
import { ProgressButton } from '~/components/ui/progress-button'
import { api } from '~/rpc/client'

function SignInWithGoogle() {
  const router = useRouter()
  const signInWithGoogle = useMutation(
    api.auth.signInWithSocial.mutationOptions({
      onSuccess(data) {
        if (data.redirectUrl) {
          router.push(data.redirectUrl)
          return
        }

        // If this is not a redirect, then something went wrong
        toast.error('Error signing in with Google', {
          description: 'Something went wrong. Please try again later.',
        })
      },
      onError(error) {
        toast.error('Error signing in with Google', {
          description: error.message,
        })
      },
    }),
  )

  return (
    <ProgressButton
      variant="outline"
      className="w-full"
      isLoading={signInWithGoogle.isPending}
      onClick={() => signInWithGoogle.mutate({ provider: 'google' })}>
      <GoogleIcon />
      Sign in with Google
    </ProgressButton>
  )
}

export { SignInWithGoogle }
