import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { env } from '~/env/server'
import { requireAuthentication } from '~/features/auth/utils'
import { ProfilePage } from '~/features/user/components/profile-page'
import { SecurityPage } from '~/features/user/components/security-page'
import { getSupportedProviders } from '~/lib/utils'
import { api } from '~/rpc/server'
import type { NextServerPageProps } from '~/types/shared'

async function AccountPageImpl({
  searchParams,
}: Pick<NextServerPageProps, 'searchParams'>) {
  const session = await requireAuthentication()
  const accounts = await api.user.listAccounts()
  const searchParamsValue = await searchParams
  const view =
    typeof searchParamsValue['view'] === 'string' &&
    ['profile', 'security'].includes(searchParamsValue['view'])
      ? searchParamsValue['view']
      : 'profile'

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Hello, {session.user.name}!</h2>
        <p className="text-md text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <div className="min-h-0 flex-1">
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
      </div>
    </div>
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
