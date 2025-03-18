import { auth, currentUser } from '@clerk/nextjs/server'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SetupForm } from './_components/setup-form'

export default async function SetupPage() {
  const user = await currentUser()
  const { redirectToSignIn } = await auth()

  if (!user) {
    redirectToSignIn()
    return
  }

  return (
    <div className="container flex max-w-2xl flex-col gap-4">
      <h1 className="text-center text-3xl">
        Welcome, <span className="font-bold">{user.firstName}!</span> 👋
      </h1>
      <h2 className="text-muted-foreground text-center">
        Let&apos;s start by creating your first household!
      </h2>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Household</CardTitle>
          <CardDescription>Configure household details</CardDescription>
        </CardHeader>
        <CardContent>
          <SetupForm />
        </CardContent>
      </Card>
    </div>
  )
}
