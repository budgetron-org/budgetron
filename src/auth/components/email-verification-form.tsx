'use client'

import * as Clerk from '@clerk/elements/common'
import type { Action as SignInAction } from '@clerk/elements/sign-in'
import type { Action as SignUpAction } from '@clerk/elements/sign-up'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { AuthFormHeader } from './auth-form-header'

type Props = {
  Action: typeof SignInAction | typeof SignUpAction
  identifier?: ReactNode
}

export function EmailVerificationForm({
  Action,
  identifier = 'your email',
}: Props) {
  return (
    <div className="grid gap-6">
      <AuthFormHeader
        title="Please check your email!"
        subtitle={<>We sent an OTP to {identifier}.</>}
      />
      <Clerk.GlobalError className="block text-sm text-red-400" />
      <Clerk.Field name="code" className="grid gap-2">
        <Clerk.Label asChild>
          <Label>One-Time password</Label>
        </Clerk.Label>
        <Clerk.Input
          className="grid grid-flow-col"
          type="otp"
          autoSubmit
          render={({ status, value }) => (
            <div
              data-status={status}
              className={cn(
                'border-input relative flex size-10 items-center justify-center rounded-md border text-sm transition-all',
                {
                  'ring-ring ring-offset-background z-10 ring-2':
                    status === 'cursor' || status === 'selected',
                },
              )}>
              {value}
              {status === 'cursor' && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
                </div>
              )}
            </div>
          )}
        />
        <Clerk.FieldError className="block text-sm text-red-400" />
      </Clerk.Field>

      <Action submit asChild>
        <Button className="w-full">Verify</Button>
      </Action>
      <Action
        resend
        fallback={({ resendableAfter }) => (
          <p>Resend code in {resendableAfter} second(s)</p>
        )}
        asChild>
        <Button variant="link" className="w-full">
          Resend code
        </Button>
      </Action>
    </div>
  )
}
