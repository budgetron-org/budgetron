'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthFormHeader } from './auth-form-header'

export function PasswordVerificationForm() {
  return (
    <div className="grid gap-6">
      <AuthFormHeader
        title={
          <>
            Signing in as <SignIn.SafeIdentifier />.
          </>
        }
        subtitle={
          <SignIn.Action
            navigate="start"
            className="cursor-pointer hover:underline">
            Not you?
          </SignIn.Action>
        }
      />
      <Clerk.GlobalError className="block text-sm text-red-400" />
      <div className="grid gap-6">
        <Clerk.Field name="password" className="grid gap-2">
          <Clerk.Label asChild>
            <Label>Password</Label>
          </Clerk.Label>
          <Clerk.Input asChild>
            <Input />
          </Clerk.Input>
          <Clerk.FieldError className="block text-sm text-red-400" />
        </Clerk.Field>

        <SignIn.Action submit asChild>
          <Button className="w-full">Sign In</Button>
        </SignIn.Action>

        <SignIn.Action navigate="forgot-password" asChild>
          <Button variant="link" className="w-full">
            Trouble logging in?
          </Button>
        </SignIn.Action>
      </div>
    </div>
  )
}
