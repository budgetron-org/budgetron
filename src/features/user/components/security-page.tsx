'use client'

import { IconAlertTriangleFilled, IconKey } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { z } from 'zod/v4'

import { useRouter } from 'next/navigation'
import { GoogleIcon } from '~/components/icons'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { ProgressButton } from '~/components/ui/progress-button'
import { Separator } from '~/components/ui/separator'
import { useAppForm } from '~/hooks/use-app-form'
import type { getSupportedProviders } from '~/lib/utils'
import { api } from '~/rpc/client'
import type { getAuth } from '~/server/auth'
import type { AwaitedReturnType } from '~/types/shared'
import { SecurityFormSchema } from '../validators'
import { DeleteAccountDialog } from './delete-account-dialog'

type UserAccount = AwaitedReturnType<
  ReturnType<typeof getAuth>['api']['listUserAccounts']
>[number]

type OAuthProvider = ReturnType<typeof getSupportedProviders>[number]

function PasswordResetSection() {
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

  return (
    <div className="flex flex-col gap-6 p-2">
      <h2 className="text-2xl font-bold">Reset Password</h2>
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

        <div className="flex flex-col gap-2 md:flex-row">
          <form.Subscribe
            selector={(formState) => [formState.canSubmit, formState.isDirty]}>
            {([canSubmit, isDirty]) => (
              <form.SubmitButton
                className="w-max"
                disabled={!canSubmit || !isDirty}
                isLoading={updatePassword.isPending}>
                Update Password
              </form.SubmitButton>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  )
}

interface LinkedAccountsSectionProps {
  accounts: UserAccount[]
  providers: OAuthProvider[]
}

function LinkedAccountsSection({
  accounts,
  providers,
}: LinkedAccountsSectionProps) {
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
    <div className="flex flex-col gap-6 p-2">
      <h2 className="text-2xl font-bold">Linked Accounts</h2>
      <div className="grid w-max grid-cols-2 gap-6">
        {providers.map((provider) => {
          const { providerId, providerName } = provider

          const account = accounts.find(
            (account) => account.provider === providerId,
          )

          return (
            <div key={providerId} className="contents">
              <div className="flex items-center gap-2">
                <div>
                  {providerId === 'google' && <GoogleIcon />}
                  {providerId === 'custom-oauth-provider' && <IconKey />}
                </div>
                <div>{providerName}</div>
              </div>
              {!account && (
                <ProgressButton
                  variant="success"
                  isLoading={
                    linkAccount.isPending &&
                    linkAccount.variables.providerId === providerId
                  }
                  onClick={() => linkAccount.mutate({ providerId })}>
                  Link
                </ProgressButton>
              )}
              {account && (
                <ProgressButton
                  variant="destructive"
                  isLoading={
                    unlinkAccount.isPending &&
                    unlinkAccount.variables.providerId === providerId
                  }
                  onClick={() => unlinkAccount.mutate({ providerId })}>
                  Unlink
                </ProgressButton>
              )}
            </div>
          )
        })}
      </div>
    </div>
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
    <div className="flex flex-col gap-6 p-2">
      {hasEmailPasswordAccount && <PasswordResetSection />}
      {!hasEmailPasswordAccount && (
        <Alert>
          <IconAlertTriangleFilled />
          <AlertTitle>Password is not available for this account</AlertTitle>
          <AlertDescription>
            You have not set up a password for your account. To set a password,
            logout and use the &apos;Forgot Password&apos; link.
          </AlertDescription>
        </Alert>
      )}
      <Separator />
      <LinkedAccountsSection
        accounts={userAccounts}
        providers={availableOAuthProviders}
      />

      <Separator />

      <h2 className="text-2xl font-bold">Danger Zone</h2>
      <div className="flex w-max flex-col gap-6 p-2">
        <DeleteAccountDialog
          trigger={<Button variant="destructive">Delete Account</Button>}
          hasEmailPasswordAccount={hasEmailPasswordAccount}
        />
      </div>
    </div>
  )
}

export { SecurityPage }
