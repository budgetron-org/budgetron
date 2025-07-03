'use client'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { z } from 'zod/v4'

import { Badge } from '~/components/ui/badge'
import { ProgressButton } from '~/components/ui/progress-button'
import { AvatarPicker } from '~/components/widgets/avatar-picker'
import { useAppForm } from '~/hooks/use-app-form'
import { api } from '~/rpc/client'
import type { User } from '~/server/auth'
import { ProfileFormSchema } from '../validators'

interface ProfilePageProps {
  user: User
}

function ProfilePage({ user }: ProfilePageProps) {
  const updateInfo = useMutation(
    api.user.updateInfo.mutationOptions({
      onSuccess() {
        toast.success('Profile updated successfully')
      },
      onError(error) {
        toast.error('Failed to update profile', {
          description: error.message,
        })
      },
      onSettled() {
        form.reset()
      },
    }),
  )

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
    <div className="flex flex-col gap-6 p-2">
      <form
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
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

        {/* Changing email is not allowed for now */}
        <form.AppField name="email">
          {(field) => (
            <div className="flex items-center gap-2">
              <field.TextField
                badge={
                  <Badge
                    className="h-max w-max"
                    variant={user.emailVerified ? 'default' : 'destructive'}>
                    {user.emailVerified ? 'Verified' : 'Not Verified'}
                  </Badge>
                }
                className="flex-1"
                label="Email"
                disabled
              />
              {!user.emailVerified && (
                <ProgressButton
                  type="button"
                  className="mt-5"
                  variant="outline"
                  isLoading={verifyEmail.isPending}
                  onClick={() => verifyEmail.mutate({})}>
                  Verify
                </ProgressButton>
              )}
            </div>
          )}
        </form.AppField>

        <div className="flex flex-col gap-2 md:col-span-2 md:flex-row">
          <form.Subscribe
            selector={(formState) => [formState.canSubmit, formState.isDirty]}>
            {([canSubmit, isDirty]) => (
              <form.SubmitButton
                className="w-max"
                disabled={!canSubmit || !isDirty}
                isLoading={updateInfo.isPending}>
                Update Profile
              </form.SubmitButton>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  )
}

export { ProfilePage }
