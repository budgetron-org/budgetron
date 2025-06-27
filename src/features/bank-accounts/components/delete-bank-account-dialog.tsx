'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import type { ComponentProps, ReactNode } from 'react'
import { toast } from 'sonner'

import { AlertActionButton } from '~/components/ui/alert-action-button'
import { api } from '~/rpc/client'
import type { BankAccount } from '../types'

interface DeleteBankAccountDialogProps
  extends ComponentProps<typeof AlertActionButton> {
  bankAccount: BankAccount
  refreshOnSuccess?: boolean
  trigger: ReactNode
}

function DeleteBankAccountDialog({
  bankAccount,
  refreshOnSuccess,
  trigger,
  ...props
}: DeleteBankAccountDialogProps) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const deleteBankAccount = useMutation(
    api.bankAccounts.delete.mutationOptions({
      async onSuccess() {
        // invalidate account queries
        await queryClient.invalidateQueries({
          queryKey: api.bankAccounts.getAll.key(),
        })
        toast.success(`Deleted Bank Account - ${bankAccount.name}`)
        // refresh page if needed
        if (refreshOnSuccess) router.refresh()
      },
      onError(error) {
        toast.error(`Error deleting Bank Account - ${bankAccount.name}`, {
          description: error.message,
        })
      },
    }),
  )
  return (
    <AlertActionButton
      alertDescription={`This will delete ${bankAccount.name} and all the transactions associated with it. This cannot be undone!`}
      onConfirm={() => deleteBankAccount.mutate({ id: bankAccount.id })}
      {...props}
      asChild>
      {trigger}
    </AlertActionButton>
  )
}

export { DeleteBankAccountDialog }
