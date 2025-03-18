'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthFormHeader } from './auth-form-header'

export function SignUpDetailsForm() {
  return (
    <div className="grid gap-6">
      <AuthFormHeader title="Tell us about yourself" subtitle="Almost there" />
      <Clerk.GlobalError className="block text-sm text-red-400" />
      <div className="grid gap-6">
        <Clerk.Field name="firstName">
          <Clerk.Label asChild>
            <Label>First Name</Label>
          </Clerk.Label>
          <Clerk.Input asChild>
            <Input />
          </Clerk.Input>
          <Clerk.FieldError className="block text-sm text-red-400" />
        </Clerk.Field>

        <Clerk.Field name="lastName">
          <Clerk.Label asChild>
            <Label>Last Name</Label>
          </Clerk.Label>
          <Clerk.Input asChild>
            <Input />
          </Clerk.Input>
          <Clerk.FieldError className="block text-sm text-red-400" />
        </Clerk.Field>

        <SignUp.Action submit asChild>
          <Button className="w-full">Get Started</Button>
        </SignUp.Action>
      </div>
    </div>
  )
}
