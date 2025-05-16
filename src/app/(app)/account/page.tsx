import { IconAlertTriangleFilled } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { redirectToSignIn } from '~/features/auth/server'
import { ProfilePage } from '~/features/user/components/profile-page'
import { SecurityPage } from '~/features/user/components/security-page'
import { api } from '~/rpc/server'

async function AccountPageImpl() {
  const session = await api.auth.session()
  if (!session?.user) redirectToSignIn()
  const accounts = await api.user.listAccounts()
  const isEmailPasswordAccount = accounts.some(
    (account) => account.provider === 'credential',
  )

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-2xl">
          Hello, {session.user.firstName}!
        </CardTitle>
        <CardDescription className="text-md">
          Manage your account settings and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        <Tabs defaultValue="profile" className="h-full">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="min-h-0 overflow-y-auto">
            <ProfilePage user={session.user} />
          </TabsContent>
          <TabsContent value="security" className="min-h-0 overflow-y-auto">
            {!isEmailPasswordAccount && (
              <Alert>
                <IconAlertTriangleFilled />
                <AlertTitle>Security settings are not available</AlertTitle>
                <AlertDescription>
                  Security settings are only available for email-password
                  accounts.
                </AlertDescription>
              </Alert>
            )}
            {isEmailPasswordAccount && <SecurityPage />}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default async function AccountPage() {
  return (
    <SuspenseBoundary>
      <AccountPageImpl />
    </SuspenseBoundary>
  )
}
