'use client'

import * as Clerk from '@clerk/elements/common'
import type {
  Action as SignInAction,
  Captcha as SignInCaptcha,
} from '@clerk/elements/sign-in'
import type {
  Action as SignUpAction,
  Captcha as SignUpCaptcha,
} from '@clerk/elements/sign-up'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SeparatorText } from '@/components/ui/separator-text'
import { AuthFormHeader } from './auth-form-header'
import { AuthSSOConnections } from './auth-sso-connections'

type Props = {
  Action: typeof SignInAction | typeof SignUpAction
  actionText?: string
  Captcha?: typeof SignInCaptcha | typeof SignUpCaptcha
  footer?: ReactNode
  subtitle: string
  title: string
  type: 'sign-in' | 'sign-up'
}

export function AuthWelcomeForm({
  Action,
  actionText = 'Continue',
  Captcha,
  footer,
  subtitle,
  title,
  type,
}: Props) {
  return (
    <div className="grid gap-6">
      <AuthFormHeader title={title} subtitle={subtitle} />
      <Clerk.GlobalError className="block text-sm text-red-400" />
      <div className="grid gap-6">
        <Clerk.Field name="identifier" className="grid gap-2">
          <Clerk.Label asChild>
            <Label>Email</Label>
          </Clerk.Label>
          <Clerk.Input asChild>
            <Input placeholder="user@example.com" />
          </Clerk.Input>
          <Clerk.FieldError className="block text-sm text-red-400" />
        </Clerk.Field>

        {type === 'sign-up' && (
          <>
            <Clerk.Field name="password" className="grid gap-2">
              <Clerk.Label asChild>
                <Label>Password</Label>
              </Clerk.Label>
              <Clerk.Input asChild>
                <Input />
              </Clerk.Input>
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>

            <Clerk.Field name="confirmPassword" className="grid gap-2">
              <Clerk.Label asChild>
                <Label>Retype Password</Label>
              </Clerk.Label>
              <Clerk.Input asChild>
                <Input />
              </Clerk.Input>
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
          </>
        )}

        {Captcha && <Captcha />}

        <Action submit asChild>
          <Button className="w-full">{actionText}</Button>
        </Action>

        <SeparatorText>Or continue with</SeparatorText>

        <AuthSSOConnections />
      </div>

      {footer}
    </div>
  )
}
