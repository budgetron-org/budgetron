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
  DialogDescription,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconAlertCircle />
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription>
            This will PERMANENTLY delete your account and remove your data from
            our servers. This action cannot be undone!
          </DialogDescription>
        </DialogHeader>
        {hasEmailPasswordAccount && (
          <form.AppForm>
            <form.AppField name="password">
              {(field) => (
                <field.TextField
                  label="Enter current password"
                  type="password"
                />
              )}
            </form.AppField>
          </form.AppForm>
        )}
        <DialogFooter>
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
