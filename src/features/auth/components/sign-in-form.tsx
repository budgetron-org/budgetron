'use client'

import { IconExclamationCircle } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type ReactNode } from 'react'
import type { z } from 'zod'

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { SeparatorText } from '~/components/ui/separator-text'
import { PATHS } from '~/data/routes'
import { SignInSchema } from '~/features/auth/validators'
import { useAppForm } from '~/hooks/use-app-form'
import { api } from '~/rpc/client'
import { AuthHeader } from './auth-header'

interface SignInFormProps {
  redirectAfterSignIn: string
  providers?: ReactNode[]
}

function SignInForm({ redirectAfterSignIn, providers = [] }: SignInFormProps) {
  const router = useRouter()
  const signIn = useMutation(
    api.auth.signIn.mutationOptions({
      onSuccess() {
        router.push(redirectAfterSignIn)
      },

      context: {
        // We do not want batching for the auth calls as we need the server to set
        // auth tokens in the response header.
        skipBatch: true,
      },
    }),
  )

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    } as z.infer<typeof SignInSchema>,
    validators: {
      onSubmit: SignInSchema,
    },
    onSubmit({ value }) {
      signIn.mutate(value)
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <AuthHeader title="Sign In" subtitle="Sign in below to get started" />
      <div className="flex flex-col gap-6">
        {signIn.error && (
          <Alert>
            <IconExclamationCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{signIn.error.message}</AlertDescription>
          </Alert>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="grid gap-6">
          <form.AppField name="email">
            {(field) => <field.TextField label="Email" />}
          </form.AppField>

          <div>
            <form.AppField name="password">
              {(field) => <field.TextField label="Password" type="password" />}
            </form.AppField>
            <Link
              href={PATHS.FORGOT_PASSWORD}
              className="text-sm underline underline-offset-4">
              Forgot Password?
            </Link>
          </div>

          <form.Subscribe selector={(formState) => [formState.canSubmit]}>
            {([canSubmit]) => (
              <form.SubmitButton
                disabled={!canSubmit}
                isLoading={signIn.isPending}>
                Sign In
              </form.SubmitButton>
            )}
          </form.Subscribe>
        </form>

        {providers.length > 0 && (
          <SeparatorText>Or continue with</SeparatorText>
        )}
        {providers}

        <div className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href={PATHS.SIGN_UP} className="underline underline-offset-4">
            Sign up
          </Link>{' '}
          now!
        </div>
      </div>
    </div>
  )
}

export { SignInForm }
