'use client'

import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { toast } from 'sonner'
import type { z } from 'zod'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { AvatarPicker } from '~/components/widgets/avatar-picker'
import type { User } from '~/features/user/types'
import { useAppForm } from '~/hooks/use-app-form'
import { api } from '~/rpc/client'
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

  const form = useAppForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
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
              name="image"
              currentImage={user.image ?? undefined}
              onFileChange={field.handleChange}
            />
          )}
        </form.AppField>

        <form.AppField name="firstName">
          {(field) => <field.TextField label="First Name" />}
        </form.AppField>

        <form.AppField name="lastName">
          {(field) => <field.TextField label="Last Name" />}
        </form.AppField>

        {/* Changing email is not allowed for now */}
        <form.AppField name="email">
          {(field) => (
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
          )}
        </form.AppField>

        <div className="flex flex-col gap-2 md:col-span-2 md:flex-row">
          <Link href="/dashboard">
            <Button variant="outline">Cancel</Button>
          </Link>
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
