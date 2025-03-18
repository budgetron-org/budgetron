'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { AuthWelcomeForm } from './auth-welcome-form'
import { EmailVerificationForm } from './email-verification-form'
import { PasswordVerificationForm } from './password-verification-form'
import { ResetPasswordForm } from './reset-password-form'

export function SignInForm() {
  return (
    <div className="flex flex-col gap-6">
      <SignIn.Root>
        <SignIn.Step name="start" className="flex flex-col gap-6">
          <AuthWelcomeForm
            type="sign-in"
            Action={SignIn.Action}
            title="Welcome to Leagues!"
            subtitle="Enter your email below to login to your account"
            footer={
              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Clerk.Link
                  navigate="sign-up"
                  className="underline underline-offset-4">
                  Sign up
                </Clerk.Link>{' '}
                now!
              </div>
            }
          />
        </SignIn.Step>

        <SignIn.Step name="verifications">
          <div className="grid gap-2">
            <SignIn.Strategy name="email_code">
              <EmailVerificationForm
                identifier={<SignIn.SafeIdentifier />}
                Action={SignIn.Action}
              />
            </SignIn.Strategy>

            <SignIn.Strategy name="password">
              <PasswordVerificationForm />
            </SignIn.Strategy>

            <SignIn.Strategy name="reset_password_email_code">
              <EmailVerificationForm
                identifier={<SignIn.SafeIdentifier />}
                Action={SignIn.Action}
              />
            </SignIn.Strategy>

            <SignIn.Action navigate="choose-strategy" asChild>
              <Button variant="link" className="w-full">
                Try another way
              </Button>
            </SignIn.Action>
          </div>
        </SignIn.Step>

        <SignIn.Step name="choose-strategy">
          <div className="grid gap-6">
            <SignIn.SupportedStrategy name="email_code" asChild>
              <Button className="w-full">Sign in with an OTP</Button>
            </SignIn.SupportedStrategy>

            <SignIn.SupportedStrategy name="password" asChild>
              <Button className="w-full">Enter your password</Button>
            </SignIn.SupportedStrategy>

            <SignIn.Action navigate="previous" asChild>
              <Button variant="outline" className="w-full">
                <ArrowLeft />
                Go back
              </Button>
            </SignIn.Action>
          </div>
        </SignIn.Step>

        <SignIn.Step name="forgot-password">
          <div className="grid gap-6">
            <SignIn.SupportedStrategy name="reset_password_email_code" asChild>
              <Button className="w-full">Reset your password via Email</Button>
            </SignIn.SupportedStrategy>
            <SignIn.SupportedStrategy name="email_code" asChild>
              <Button className="w-full">Sign in with email OTP</Button>
            </SignIn.SupportedStrategy>

            <SignIn.Action navigate="previous" asChild>
              <Button variant="outline" className="w-full">
                <ArrowLeft />
                Go back
              </Button>
            </SignIn.Action>
          </div>
        </SignIn.Step>

        <SignIn.Step name="reset-password">
          <ResetPasswordForm />
        </SignIn.Step>
      </SignIn.Root>
    </div>
  )
}
