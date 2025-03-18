'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthFormHeader } from './auth-form-header'

export function ResetPasswordForm() {
  return (
    <div className="grid gap-6">
      <AuthFormHeader
        title="Reset password"
        subtitle="Choose a strong password"
      />
      <Clerk.GlobalError className="block text-sm text-red-400" />
      <div className="grid gap-6">
        <Clerk.Field name="password" className="grid gap-2">
          <Clerk.Label asChild>
            <Label>New password</Label>
          </Clerk.Label>
          <Clerk.Input asChild>
            <Input />
          </Clerk.Input>
          <Clerk.FieldError className="block text-sm text-red-400" />
        </Clerk.Field>

        <Clerk.Field name="confirmPassword" className="grid gap-2">
          <Clerk.Label asChild>
            <Label>Confirm password</Label>
          </Clerk.Label>
          <Clerk.Input asChild>
            <Input />
          </Clerk.Input>
          <Clerk.FieldError className="block text-sm text-red-400" />
        </Clerk.Field>

        <SignIn.Action submit>
          <Button className="w-full">Reset password</Button>
        </SignIn.Action>
      </div>
    </div>
  )
}
