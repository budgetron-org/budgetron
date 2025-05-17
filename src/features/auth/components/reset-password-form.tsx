'use client'

import { IconExclamationCircle } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import type { z } from 'zod'

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { ResetPasswordSchema } from '~/features/auth/validators'
import { useAppForm } from '~/hooks/use-app-form'
import { api } from '~/rpc/client'
import { AuthScreenLayout } from './auth-screen-layout'

interface ResetPasswordFormProps {
  token: string
}

function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const resetPassword = useMutation(api.auth.resetPassword.mutationOptions())

  const form = useAppForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
      token,
    } as z.infer<typeof ResetPasswordSchema>,
    validators: {
      onSubmit: ResetPasswordSchema,
    },
    onSubmit({ value }) {
      resetPassword.mutate(value)
    },
  })

  return (
    <AuthScreenLayout
      title="Reset password"
      subtitle="Enter your new password.">
      {(resetPassword.isIdle || resetPassword.isPending) && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="grid gap-6">
          <form.AppField name="password">
            {(field) => <field.TextField label="Password" type="password" />}
          </form.AppField>

          <form.AppField name="confirmPassword">
            {(field) => (
              <field.TextField label="Confirm Password" type="password" />
            )}
          </form.AppField>

          <form.Subscribe
            selector={(formState) => [formState.canSubmit, formState.isDirty]}>
            {([canSubmit, isDirty]) => (
              <form.SubmitButton
                disabled={!canSubmit || !isDirty}
                isLoading={resetPassword.isPending}
                className="w-full">
                Reset password
              </form.SubmitButton>
            )}
          </form.Subscribe>
        </form>
      )}

      {/**
       * Once the reset is completed, we show a success message and ask the user to sign in.
       */}
      {resetPassword.isSuccess && (
        <div className="flex flex-col gap-4">
          <p>Password reset successfully. Please sign in.</p>
          <Link href="/sign-in" className="self-center">
            <Button>Go to Sign In</Button>
          </Link>
        </div>
      )}

      {/**
       * If the reset fails, we show an error message and ask the user to try again.
       */}
      {resetPassword.isError && (
        <div className="flex flex-col gap-4">
          <Alert>
            <IconExclamationCircle className="h-4 w-4" />
            <AlertTitle>Could not reset password</AlertTitle>
            <AlertDescription>
              Please try again or contact support.
            </AlertDescription>
          </Alert>
          <Link href="/sign-in" className="self-center">
            <Button>Go back to Sign In</Button>
          </Link>
        </div>
      )}
    </AuthScreenLayout>
  )
}

export { ResetPasswordForm }
