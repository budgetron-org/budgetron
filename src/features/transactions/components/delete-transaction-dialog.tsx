'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import type { ComponentProps, ReactNode } from 'react'
import { toast } from 'sonner'

import { AlertActionButton } from '~/components/ui/alert-action-button'
import { api } from '~/rpc/client'
import type { Transaction } from '../types'

type DeleteTransactionDialogProps = ComponentProps<typeof AlertActionButton> & {
  transaction: Transaction
  refreshOnSuccess?: boolean
  trigger: ReactNode
}

function DeleteTransactionDialog({
  transaction,
  refreshOnSuccess,
  trigger,
  ...props
}: DeleteTransactionDialogProps) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const deleteTransaction = useMutation(
    api.transactions.delete.mutationOptions({
      onSuccess() {
        toast.success(`Deleted Transaction - ${transaction.description}`)
        // invalidate transaction and analytics queries
        queryClient.invalidateQueries({
          queryKey: [...api.transactions.key(), ...api.analytics.key()],
        })
        // refresh page if needed
        if (refreshOnSuccess) router.refresh()
      },
      onError(error) {
        toast.error(`Error deleting Transaction - ${transaction.description}`, {
          description: error.message,
        })
      },
    }),
  )
  return (
    <AlertActionButton
      alertDescription={`This will permanently delete the transaction "${transaction.description}". This cannot be undone!`}
      onConfirm={() => deleteTransaction.mutate({ id: transaction.id })}
      {...props}
      asChild>
      {trigger}
    </AlertActionButton>
  )
}

export { DeleteTransactionDialog }
