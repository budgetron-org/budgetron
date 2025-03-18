'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'

import { AuthWelcomeForm } from './auth-welcome-form'
import { EmailVerificationForm } from './email-verification-form'
import { SignUpDetailsForm } from './sign-up-details-form'

export function SignUpForm() {
  return (
    <div className="flex flex-col gap-6">
      <SignUp.Root>
        <SignUp.Step name="start" className="flex flex-col gap-6">
          <AuthWelcomeForm
            type="sign-up"
            Action={SignUp.Action}
            actionText="Sign Up"
            Captcha={SignUp.Captcha}
            title="Create a new account"
            subtitle="It's quick and easy"
            footer={
              <div className="text-center text-sm">
                Already have an account?{' '}
                <Clerk.Link
                  navigate="sign-in"
                  className="underline underline-offset-4">
                  Sign in
                </Clerk.Link>
                !
              </div>
            }
          />
        </SignUp.Step>

        <SignUp.Step name="verifications">
          <SignUp.Strategy name="email_code">
            <EmailVerificationForm Action={SignUp.Action} />
          </SignUp.Strategy>
        </SignUp.Step>

        <SignUp.Step name="continue">
          <SignUpDetailsForm />
        </SignUp.Step>
      </SignUp.Root>
    </div>
  )
}
