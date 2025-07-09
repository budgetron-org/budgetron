'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useId, useRef, useState, type ReactNode } from 'react'
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { DialogDrawer, DialogDrawerClose } from '~/components/ui/dialog-drawer'
import { ProgressButton } from '~/components/ui/progress-button'
import { api } from '~/rpc/client'
import type { BankAccount } from '../types'
import {
  BankAccountForm,
  type BankAccountFormHandle,
} from './bank-account-form'

interface UpdateBankAccountDialogProps {
  bankAccount: BankAccount
  refreshOnSuccess?: boolean
  trigger: ReactNode
}

export function UpdateBankAccountDialog({
  bankAccount,
  refreshOnSuccess,
  trigger,
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

  return (
    <DialogDrawer
      open={open}
      onOpenChange={setOpen}
      title={`Update Bank account - ${bankAccount.name}`}
      description="Enter the new details of the bank account"
      trigger={trigger}
      footer={
        <>
          <DialogDrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogDrawerClose>
          <ProgressButton
            form={formId}
            type="submit"
            isLoading={updateBankAccount.isPending}>
            Update
          </ProgressButton>
        </>
      }>
      <BankAccountForm
        id={formId}
        ref={formRef}
        defaultValues={bankAccount}
        hiddenFields={['currency']}
        onSubmit={(data) =>
          updateBankAccount.mutate({ ...data, id: bankAccount.id })
        }
      />
    </DialogDrawer>
  )
}
