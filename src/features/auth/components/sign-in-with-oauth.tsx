'use client'

import { IconKey } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { ProgressButton } from '~/components/ui/progress-button'
import { api } from '~/rpc/client'

interface SignInWithOAuthProps {
  providerName?: string
}

function SignInWithOAuth({ providerName = 'OAuth' }: SignInWithOAuthProps) {
  const router = useRouter()
  const signInWithOAuth = useMutation(
    api.auth.signInWithOAuth.mutationOptions({
      onSuccess(data) {
        if (data.redirectUrl) {
          router.push(data.redirectUrl)
          return
        }

        // If this is not a redirect, then something went wrong
        toast.error(`Error signing in with ${providerName}`, {
          description: 'Something went wrong. Please try again later.',
        })
      },
      onError(error) {
        toast.error(`Error signing in with ${providerName}`, {
          description: error.message,
        })
      },
    }),
  )

  return (
    <ProgressButton
      variant="outline"
      className="w-full"
      isLoading={signInWithOAuth.isPending}
      onClick={() =>
        signInWithOAuth.mutate({ providerId: 'custom-oauth-provider' })
      }>
      <IconKey />
      Sign in with {providerName}
    </ProgressButton>
  )
}

export { SignInWithOAuth }
