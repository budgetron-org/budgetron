'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  useCallback,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { ProgressButton } from '~/components/ui/progress-button'
import { api } from '~/rpc/client'
import type { BankAccount } from '../types'
import {
  BankAccountForm,
  type BankAccountFormHandle,
} from './bank-account-form'

interface UpdateBankAccountDialogProps extends ComponentProps<typeof Dialog> {
  bankAccount: BankAccount
  refreshOnSuccess?: boolean
  trigger: ReactNode
}

export function UpdateBankAccountDialog({
  bankAccount,
  refreshOnSuccess,
  trigger,
  ...props
}: UpdateBankAccountDialogProps) {
  const formRef = useRef<BankAccountFormHandle>(null)
  const formId = useId()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const updateBankAccount = useMutation(
    api.bankAccounts.update.mutationOptions({
      async onSuccess({ name }) {
        // invalidate account queries
        await queryClient.invalidateQueries({
          queryKey: api.bankAccounts.getAll.key(),
        })
        formRef.current?.reset()
        setOpen(false)
        toast.success(
          `Updated Bank Account - ${bankAccount.name}${bankAccount.name !== name ? ` to ${name}` : ''}`,
        )
        // refresh page if needed
        if (refreshOnSuccess) router.refresh()
      },
      onError(error) {
        toast.error(`Error updating Bank Account - ${bankAccount.name}`, {
          description: error.message,
        })
      },
    }),
  )

  const closeDialog = useCallback(() => setOpen(false), [])
  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open)
  }, [])

  return (
    <Dialog {...props} open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Bank account - {bankAccount.name}</DialogTitle>
          <DialogDescription>
            Enter the new details of the bank account
          </DialogDescription>
        </DialogHeader>

        <BankAccountForm
          id={formId}
          ref={formRef}
          defaultValues={bankAccount}
          onSubmit={(data) =>
            updateBankAccount.mutate({ ...data, id: bankAccount.id })
          }
        />

        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <ProgressButton
            form={formId}
            type="submit"
            isLoading={updateBankAccount.isPending}>
            Update
          </ProgressButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
