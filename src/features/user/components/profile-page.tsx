'use client'

import { useMutation } from '@tanstack/react-query'
import { capitalize } from 'lodash'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { z } from 'zod/v4'

import { AvatarPicker } from '~/components/pickers/avatar-picker'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { ProgressButton } from '~/components/ui/progress-button'
import { useAppForm } from '~/hooks/use-app-form'
import { APP_NAME } from '~/lib/app-metadata'
import { api } from '~/rpc/client'
import type { User } from '~/server/auth'
import { ProfileFormSchema } from '../validators'
import { AccountPageContainer } from './account-page-container'
import { AccountPageSection } from './account-page-section'
import { DeleteAccountDialog } from './delete-account-dialog'

function AvatarNameSection({ user }: { user: User }) {
  const router = useRouter()
  const updateInfo = useMutation(
    api.user.updateInfo.mutationOptions({
      onSuccess() {
        toast.success('Profile updated successfully')
        router.refresh()
      },
      onError(error) {
        toast.error('Failed to update profile', {
          description: error.message,
        })
      },
    }),
  )

  const form = useAppForm({
    defaultValues: {
      name: user.name,
      email: user.email,
    } as z.infer<typeof ProfileFormSchema>,
    validators: {
      onSubmit: ProfileFormSchema,
    },
    onSubmit: ({ value }) => {
      updateInfo.mutate(value)
    },
  })

  return (
    <AccountPageSection
      title="Profile"
      description="Add an avatar and update your display name."
      footer={
        <form.AppForm>
          <form.SubmitButton
            className="w-max"
            isLoading={updateInfo.isPending}
            submitOnClick>
            Save
          </form.SubmitButton>
        </form.AppForm>
      }>
      <form
        className="grid max-w-lg grid-cols-1 gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}>
        <form.AppField name="image">
          {(field) => (
            <AvatarPicker
              className="md:col-span-2"
              email={user.email}
              userDisplayName={user.name}
              name="image"
              currentImage={user.image ?? undefined}
              onImageChange={field.handleChange}
            />
          )}
        </form.AppField>

        <form.AppField name="name">
          {(field) => <field.TextField label="Display Name" />}
        </form.AppField>
      </form>
    </AccountPageSection>
  )
}

function EmailSection({ user }: { user: User }) {
  const verifyEmail = useMutation(
    api.user.verifyEmail.mutationOptions({
      onSuccess() {
        toast.success('Email verification sent. Please check your inbox.')
      },
      onError(error) {
        toast.error('Failed to send email verification', {
          description: error.message,
        })
      },
    }),
  )

  return (
    <AccountPageSection
      title="Email"
      description="The email address associated with your account. This is used for logging in to your account and receiving notifications.">
      <div className="flex items-center gap-4 rounded-xl border p-4">
        {user.email}
        <div className="flex items-center gap-2">
          {user.emailVerified && <Badge variant="success">Verified</Badge>}
          {!user.emailVerified && (
            <Badge variant="destructive">Unverified</Badge>
          )}
          <Badge variant="default">Primary</Badge>
        </div>
        {!user.emailVerified && (
          <ProgressButton
            type="button"
            className="ml-auto"
            variant="outline"
            isLoading={verifyEmail.isPending}
            onClick={() => verifyEmail.mutate({})}>
            Resend verification email
          </ProgressButton>
        )}
      </div>
    </AccountPageSection>
  )
}

function DeleteAccountSection() {
  return (
    <AccountPageSection
      title="Danger Zone"
      footer={
        <DeleteAccountDialog
          trigger={<Button variant="destructive">Delete Account</Button>}
          hasEmailPasswordAccount={true}
        />
      }
      variant="danger">
      Permanently remove your account and all of its contents from the
      {capitalize(APP_NAME)} platform. This action is not reversible, so please
      continue with caution.
    </AccountPageSection>
  )
}

interface ProfilePageProps {
  user: User
}

function ProfilePage({ user }: ProfilePageProps) {
  return (
    <AccountPageContainer>
      <AvatarNameSection user={user} />
      <EmailSection user={user} />
      <DeleteAccountSection />
    </AccountPageContainer>
  )
}

export { ProfilePage }
