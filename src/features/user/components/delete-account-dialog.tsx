'use client'

import { IconAlertCircle } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { z } from 'zod/v4'

import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { ProgressButton } from '~/components/ui/progress-button'
import { useAppForm } from '~/hooks/use-app-form'
import { api } from '~/rpc/client'
import { DeleteAccountFormSchema } from '../validators'

interface DeleteAccountDialogProps {
  trigger: ReactNode
  hasEmailPasswordAccount?: boolean
}

function DeleteAccountDialog({
  trigger,
  hasEmailPasswordAccount,
}: DeleteAccountDialogProps) {
  const [open, setOpen] = useState(false)
  const form = useAppForm({
    defaultValues: {
      password: '',
      deleteAccountConfirmation: '' as never,
    } as z.infer<typeof DeleteAccountFormSchema>,
    validators: {
      onSubmit: DeleteAccountFormSchema,
    },
    onSubmit({ value }) {
      deleteAccount.mutate({ password: value.password })
    },
  })
  const deleteAccount = useMutation(
    api.user.deleteAccount.mutationOptions({
      onSuccess() {
        toast.success(
          'Deletion request submitted successfully. Check your email for next steps.',
        )
        setOpen(false)
      },
      onError(error) {
        toast.error('Failed to submit deletion request', {
          description: error.message,
        })
      },
    }),
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="px-0">
        <DialogHeader className="px-6">
          <DialogTitle className="flex items-center gap-2">
            <IconAlertCircle />
            Delete Personal Account
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 px-6">
          We will delete all your personal data, along with all the
          transactions, budgets, and accounts associated with your account.
          <div className="bg-destructive/20 rounded-md p-2 text-red-600">
            This action is irreversible. Please proceed with caution.
          </div>
        </div>
        <div className="flex flex-col gap-2 border-y p-6">
          {hasEmailPasswordAccount && (
            <form.AppForm>
              <form.AppField name="password">
                {(field) => (
                  <field.TextField
                    label="Enter current password"
                    type="password"
                    autoComplete="current-password"
                  />
                )}
              </form.AppField>
            </form.AppForm>
          )}

          <form.AppForm>
            <form.AppField name="deleteAccountConfirmation">
              {(field) => (
                <field.TextField
                  label="To verify, type 'delete account' below"
                  autoComplete="off"
                />
              )}
            </form.AppField>
          </form.AppForm>
        </div>
        <DialogFooter className="px-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <ProgressButton
            isLoading={deleteAccount.isPending}
            onClick={() => {
              // If this account has email-password, perform API call through form
              if (hasEmailPasswordAccount) {
                form.handleSubmit()
                return
              }
              // otherwise, simply invoke deletion API directly.
              deleteAccount.mutate({})
            }}
            variant="destructive">
            Request Deletion
          </ProgressButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { DeleteAccountDialog }
