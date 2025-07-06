'use client'

import { IconAlertTriangleFilled, IconKey } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { z } from 'zod/v4'

import { capitalize } from 'lodash'
import { useRouter } from 'next/navigation'
import { GoogleIcon } from '~/components/icons'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { ProgressButton } from '~/components/ui/progress-button'
import { useAppForm } from '~/hooks/use-app-form'
import type { getSupportedProviders } from '~/lib/utils'
import { api } from '~/rpc/client'
import type { getAuth } from '~/server/auth'
import type { AwaitedReturnType } from '~/types/shared'
import { SecurityFormSchema } from '../validators'
import { AccountPageContainer } from './account-page-container'
import { AccountPageSection } from './account-page-section'

type UserAccount = AwaitedReturnType<
  ReturnType<typeof getAuth>['api']['listUserAccounts']
>[number]

type OAuthProvider = ReturnType<typeof getSupportedProviders>[number]

const PROVIDER_ICONS = {
  google: <GoogleIcon />,
  'custom-oauth-provider': <IconKey />,
} as const satisfies Record<OAuthProvider['providerId'], React.ReactNode>

interface PasswordResetSectionProps {
  isEnabled: boolean
}
function PasswordResetSection({ isEnabled }: PasswordResetSectionProps) {
  const updatePassword = useMutation(
    api.user.updatePassword.mutationOptions({
      onSuccess() {
        toast.success('Password updated successfully')
      },
      onError(error) {
        toast.error('Failed to update password', {
          description: error.message,
        })
      },
      onSettled() {
        form.reset()
      },
    }),
  )

  const form = useAppForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    } as z.infer<typeof SecurityFormSchema>,
    validators: {
      onSubmit: SecurityFormSchema,
    },
    onSubmit: ({ value }) => updatePassword.mutate(value),
  })

  if (!isEnabled) {
    return (
      <AccountPageSection
        title="Reset Password"
        description="Update your password.">
        <Alert>
          <IconAlertTriangleFilled />
          <AlertTitle>Password is not available for this account</AlertTitle>
          <AlertDescription>
            You have not set up a password for your account. To set a password,
            logout and use the &apos;Forgot Password&apos; link.
          </AlertDescription>
        </Alert>
      </AccountPageSection>
    )
  }

  return (
    <AccountPageSection
      title="Reset Password"
      description="Update your password."
      footer={
        <form.AppForm>
          <form.SubmitButton
            className="w-max"
            isLoading={updatePassword.isPending}
            submitOnClick>
            Update Password
          </form.SubmitButton>
        </form.AppForm>
      }>
      <form
        className="grid max-w-xl grid-cols-1 gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}>
        <form.AppField name="oldPassword">
          {(field) => <field.TextField label="Old Password" type="password" />}
        </form.AppField>

        <form.AppField name="newPassword">
          {(field) => <field.TextField label="New Password" type="password" />}
        </form.AppField>

        <form.AppField name="confirmPassword">
          {(field) => (
            <field.TextField label="Confirm Password" type="password" />
          )}
        </form.AppField>
      </form>
    </AccountPageSection>
  )
}

interface LinkedAccountItemProps {
  as?: 'li' | 'div'
  account?: UserAccount
  provider: OAuthProvider
  icon: React.ReactNode
  onLinkAccount: () => void
  onUnlinkAccount: () => void
  isLoading?: boolean
}
function LinkedAccountItem({
  as,
  provider,
  account,
  icon,
  onLinkAccount,
  onUnlinkAccount,
  isLoading,
}: LinkedAccountItemProps) {
  const Component = as ?? 'div'
  return (
    <Component className="flex items-center gap-4 border-b p-4 last:border-b-0">
      <div>{icon}</div>
      <div>
        <div className="font-semibold">{provider.providerName}</div>
        <div className="text-muted-foreground text-sm">
          {account
            ? `Connected on ${account.createdAt.toLocaleDateString()}`
            : `Connect your ${capitalize(provider.providerName)} account`}
        </div>
      </div>
      <ProgressButton
        className="ml-auto"
        variant={account ? 'destructive' : 'default'}
        isLoading={isLoading}
        onClick={() => {
          if (account) {
            onUnlinkAccount()
          } else {
            onLinkAccount()
          }
        }}>
        {account ? 'Disconnect' : 'Connect'}
      </ProgressButton>
    </Component>
  )
}

interface SignInMethodsSectionProps {
  accounts: UserAccount[]
  providers: OAuthProvider[]
}

function SignInMethodsSection({
  accounts,
  providers,
}: SignInMethodsSectionProps) {
  const router = useRouter()
  const linkAccount = useMutation(
    api.user.linkAccount.mutationOptions({
      onSuccess(data) {
        if (data?.redirectUrl) {
          router.push(data.redirectUrl)
          return
        }
      },
      onError(error) {
        toast.error('Failed to link account', {
          description: error.message,
        })
      },
    }),
  )

  const unlinkAccount = useMutation(
    api.user.unlinkAccount.mutationOptions({
      onSuccess() {
        toast.success('Account unlinked successfully')
        router.refresh()
      },
      onError(error) {
        toast.error('Failed to unlink account', {
          description: error.message,
        })
      },
    }),
  )

  return (
    <AccountPageSection
      title="Sign-in Methods"
      description="Customize how you access your account. Link your social profiles for seamless, secure authentication.">
      <ul className="flex flex-col rounded-xl border">
        {/* Sign in using Linked Accounts */}
        {providers.map((provider) => {
          const { providerId } = provider
          const account = accounts.find(
            (account) => account.provider === providerId,
          )
          const icon = PROVIDER_ICONS[providerId]

          return (
            <LinkedAccountItem
              key={providerId}
              as="li"
              icon={icon}
              provider={provider}
              account={account}
              onLinkAccount={() => linkAccount.mutate({ providerId })}
              onUnlinkAccount={() => unlinkAccount.mutate({ providerId })}
              isLoading={
                (linkAccount.isPending &&
                  linkAccount.variables?.providerId === providerId) ||
                (unlinkAccount.isPending &&
                  unlinkAccount.variables?.providerId === providerId)
              }
            />
          )
        })}
      </ul>
    </AccountPageSection>
  )
}

interface SecurityPageProps {
  userAccounts: UserAccount[]
  availableOAuthProviders: OAuthProvider[]
}

function SecurityPage({
  userAccounts,
  availableOAuthProviders,
}: SecurityPageProps) {
  const hasEmailPasswordAccount = userAccounts.some(
    (account) => account.provider === 'credential',
  )

  return (
    <AccountPageContainer>
      <PasswordResetSection isEnabled={hasEmailPasswordAccount} />
      <SignInMethodsSection
        accounts={userAccounts}
        providers={availableOAuthProviders}
      />
    </AccountPageContainer>
  )
}

export { SecurityPage }
