'use client'

import { IconExclamationCircle } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import type { z } from 'zod'

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { ForgotPasswordSchema } from '~/features/auth/validators'
import { useAppForm } from '~/hooks/use-app-form'
import { api } from '~/rpc/client'
import { AuthScreenLayout } from './auth-screen-layout'
import { Button } from '~/components/ui/button'

function ForgotPasswordForm() {
  const forgotPassword = useMutation(
    api.auth.forgotPassword.mutationOptions({
      onSuccess() {},
    }),
  )

  const form = useAppForm({
    defaultValues: {
      email: '',
    } as z.infer<typeof ForgotPasswordSchema>,
    validators: {
      onSubmit: ForgotPasswordSchema,
    },
    onSubmit({ value }) {
      forgotPassword.mutate(value)
    },
  })

  return (
    <AuthScreenLayout
      title="Forgot your password?"
      subtitle="Enter your email address and we'll send you a link to reset your password.">
      {forgotPassword.error && (
        <Alert>
          <IconExclamationCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{forgotPassword.error.message}</AlertDescription>
        </Alert>
      )}
      {forgotPassword.isSuccess && (
        <div className="flex flex-col gap-4">
          <p>
            We have sent you a link to reset your password. Please check your
            email.
          </p>
          <Link href="/sign-in" className="self-center">
            <Button>Go to Sign In</Button>
          </Link>
        </div>
      )}
      {!forgotPassword.isSuccess && (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="grid gap-6">
            <form.AppField name="email">
              {(field) => <field.TextField label="Email" />}
            </form.AppField>

            <form.Subscribe selector={(formState) => [formState.canSubmit]}>
              {([canSubmit]) => (
                <form.SubmitButton
                  disabled={!canSubmit}
                  isLoading={forgotPassword.isPending}>
                  Send reset password link
                </form.SubmitButton>
              )}
            </form.Subscribe>
          </form>

          <div className="text-center text-sm">
            Remembered your password?{' '}
            <Link href="/sign-in" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </>
      )}
    </AuthScreenLayout>
  )
}

export { ForgotPasswordForm }
