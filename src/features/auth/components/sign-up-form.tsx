'use client'

import { IconExclamationCircle } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import type { z } from 'zod/v4'

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { SeparatorText } from '~/components/ui/separator-text'
import { PATHS } from '~/data/routes'
import { SignUpSchema } from '~/features/auth/validators'
import { useAppForm } from '~/hooks/use-app-form'
import { api } from '~/rpc/client'
import { AuthHeader } from './auth-header'

interface SignUpFormProps {
  redirectAfterSignUp: string
  providers?: ReactNode[]
}

function SignUpForm({ redirectAfterSignUp, providers = [] }: SignUpFormProps) {
  const router = useRouter()
  const signUp = useMutation(
    api.auth.signUp.mutationOptions({
      onSuccess() {
        router.push(redirectAfterSignUp)
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
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    } as z.infer<typeof SignUpSchema>,
    validators: {
      onSubmit: SignUpSchema,
    },
    onSubmit({ value }) {
      signUp.mutate(value)
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <AuthHeader
        title="Create a new account!"
        subtitle="It's quick and easy"
      />
      <div className="flex flex-col gap-6">
        {signUp.error && (
          <Alert>
            <IconExclamationCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{signUp.error.message}</AlertDescription>
          </Alert>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="grid gap-6">
          <form.AppField name="name">
            {(field) => (
              <field.TextField label="Display Name" autoComplete="name" />
            )}
          </form.AppField>

          <form.AppField name="email">
            {(field) => <field.TextField label="Email" autoComplete="email" />}
          </form.AppField>

          <form.AppField name="password">
            {(field) => (
              <field.TextField
                label="Password"
                type="password"
                autoComplete="new-password"
              />
            )}
          </form.AppField>

          <form.AppField name="confirmPassword">
            {(field) => (
              <field.TextField
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
              />
            )}
          </form.AppField>

          <form.AppForm>
            <form.SubmitButton isLoading={signUp.isPending}>
              Sign Up
            </form.SubmitButton>
          </form.AppForm>
        </form>

        {providers.length > 0 && (
          <SeparatorText>Or continue with</SeparatorText>
        )}
        {providers}

        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link href={PATHS.SIGN_IN} className="underline underline-offset-4">
            Sign in
          </Link>
          !
        </div>
      </div>
    </div>
  )
}

export { SignUpForm }
