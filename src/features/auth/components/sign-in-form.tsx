'use client'

import { AlertCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { z } from 'zod'

import { GoogleIcon } from '~/components/icons'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { SeparatorText } from '~/components/ui/separator-text'
import { SignInSchema } from '~/features/auth/validators'
import { api } from '~/trpc/client'
import { useAuthForm } from '../hooks/use-auth-form'
import { AuthScreenLayout } from './auth-screen-layout'

export function SignInForm() {
  const router = useRouter()
  const signIn = api.auth.signIn.useMutation({
    onSuccess({ redirect }) {
      router.push(redirect)
    },
    trpc: {
      context: {
        // We do not want batching for the auth calls as we need the server to set
        // auth tokens in the response header.
        skipBatch: true,
      },
    },
  })
  const form = useAuthForm({
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
    <AuthScreenLayout
      title="Welcome to Budgetify!"
      subtitle="Sign in below to get started">
      {signIn.error && (
        <Alert>
          <AlertCircleIcon className="h-4 w-4" />
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

        <form.AppField name="password">
          {(field) => <field.TextField label="Password" type="password" />}
        </form.AppField>

        <form.Subscribe selector={(formState) => [formState.canSubmit]}>
          {([canSubmit]) => (
            <form.SubmitButton disabled={!canSubmit || signIn.isPending}>
              Sign In
            </form.SubmitButton>
          )}
        </form.Subscribe>
      </form>

      <SeparatorText>Or continue with</SeparatorText>

      <Button variant="outline" className="w-full">
        <GoogleIcon />
        Sign in with Google
      </Button>
      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="underline underline-offset-4">
          Sign up
        </Link>{' '}
        now!
      </div>
    </AuthScreenLayout>
  )
}
