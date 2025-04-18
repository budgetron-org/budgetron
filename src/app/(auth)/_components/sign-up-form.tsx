'use client'

import { AlertCircleIcon } from 'lucide-react'
import Link from 'next/link'
import type { z } from 'zod'
import { useRouter } from 'next/navigation'

import { GoogleIcon } from '~/components/icons'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { SeparatorText } from '~/components/ui/separator-text'
import { SignUpSchema } from '~/features/auth/validators'
import { api } from '~/trpc/client'
import { AuthScreenLayout } from '../_components/auth-screen-layout'
import { useAuthForm } from '../_hooks/use-auth-form'

export function SignUpForm() {
  const router = useRouter()
  const signUp = api.auth.signUp.useMutation({
    onSuccess({ redirect }) {
      router.push(redirect)
    },
  })
  const form = useAuthForm({
    defaultValues: {
      firstName: '',
      lastName: '',
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
    <AuthScreenLayout
      title="Create a new account!"
      subtitle="It's quick and easy">
      {signUp.error && (
        <Alert>
          <AlertCircleIcon className="h-4 w-4" />
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
        <div className="grid grid-cols-2 gap-4">
          <form.AppField name="firstName">
            {(field) => <field.TextField label="First Name" />}
          </form.AppField>

          <form.AppField name="lastName">
            {(field) => <field.TextField label="Last Name" />}
          </form.AppField>
        </div>

        <form.AppField name="email">
          {(field) => <field.TextField label="Email" />}
        </form.AppField>

        <form.AppField name="password">
          {(field) => <field.TextField label="Password" type="password" />}
        </form.AppField>

        <form.AppField name="confirmPassword">
          {(field) => (
            <field.TextField label="Confirm Password" type="password" />
          )}
        </form.AppField>

        <form.Subscribe selector={(formState) => [formState.canSubmit]}>
          {([canSubmit]) => (
            <form.SubmitButton disabled={!canSubmit || signUp.isPending}>
              Sign Up
            </form.SubmitButton>
          )}
        </form.Subscribe>
      </form>

      <SeparatorText>Or continue with</SeparatorText>

      <Button variant="outline" className="w-full">
        <GoogleIcon />
        Sign up with Google
      </Button>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/sign-in" className="underline underline-offset-4">
          Sign in
        </Link>
        !
      </div>
    </AuthScreenLayout>
  )
}
