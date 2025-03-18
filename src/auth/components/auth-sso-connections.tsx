'use client'

import * as Clerk from '@clerk/elements/common'

import { AppleIcon, GoogleIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

export function AuthSSOConnections() {
  return (
    <>
      <Clerk.Connection name="apple" asChild>
        <Button variant="outline" className="w-full">
          <AppleIcon />
          Login with Apple
        </Button>
      </Clerk.Connection>

      <Clerk.Connection name="google" asChild>
        <Button variant="outline" className="w-full">
          <GoogleIcon />
          Login with Google
        </Button>
      </Clerk.Connection>
    </>
  )
}
