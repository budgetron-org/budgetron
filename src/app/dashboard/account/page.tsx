import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { PATHS } from '~/data/routes'
import { env } from '~/env/server'
import { redirectToSignIn } from '~/features/auth/server'
import { ProfilePage } from '~/features/user/components/profile-page'
import { SecurityPage } from '~/features/user/components/security-page'
import { getSupportedProviders } from '~/lib/utils'
import { api } from '~/rpc/server'
import type { NextServerPageProps } from '~/types/shared'

async function AccountPageImpl({
  searchParams,
}: Pick<NextServerPageProps, 'searchParams'>) {
  const session = await api.auth.session()
  if (!session?.user) redirectToSignIn()
  const accounts = await api.user.listAccounts()
  const searchParamsValue = await searchParams
  const view =
    typeof searchParamsValue['view'] === 'string' &&
    ['profile', 'security'].includes(searchParamsValue['view'])
      ? searchParamsValue['view']
      : 'profile'

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <Link href={PATHS.DASHBOARD}>
          <Button variant="outline">
            <IconArrowLeft /> Back
          </Button>
        </Link>
        <CardTitle className="text-2xl">
          Hello, {session.user.firstName}!
        </CardTitle>
        <CardDescription className="text-md">
          Manage your account settings and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        <Tabs defaultValue={view} className="h-full">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="min-h-0 overflow-y-auto">
            <ProfilePage user={session.user} />
          </TabsContent>
          <TabsContent value="security" className="min-h-0 overflow-y-auto">
            <SecurityPage
              userAccounts={accounts}
              availableOAuthProviders={getSupportedProviders(env)}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default async function AccountPage({
  searchParams,
}: NextServerPageProps) {
  return (
    <SuspenseBoundary>
      <AccountPageImpl searchParams={searchParams} />
    </SuspenseBoundary>
  )
}
