'use client'

import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import type { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { useAppForm } from '~/hooks/use-app-form'
import { api } from '~/rpc/client'
import { SecurityFormSchema } from '../validators'

function SecurityPage() {
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
          <Link href="/dashboard">
            <Button variant="outline">Cancel</Button>
          </Link>
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

export { SecurityPage }
