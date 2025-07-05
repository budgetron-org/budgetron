'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import type { ComponentProps, ReactNode } from 'react'
import { toast } from 'sonner'

import { AlertActionButton } from '~/components/ui/alert-action-button'
import { api } from '~/rpc/client'
import type { Transaction } from '../types'

interface DeleteSelectedTransactionsDialogProps
  extends ComponentProps<typeof AlertActionButton> {
  transactions: Transaction[]
  refreshOnSuccess?: boolean
  trigger: ReactNode
}

function DeleteSelectedTransactionsDialog({
  transactions,
  refreshOnSuccess,
  trigger,
  ...props
}: DeleteSelectedTransactionsDialogProps) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const deleteTransactions = useMutation(
    api.transactions.deleteMany.mutationOptions({
      async onSuccess() {
        // invalidate transaction and analytics queries
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: api.transactions.key(),
          }),
          queryClient.invalidateQueries({
            queryKey: api.analytics.key(),
          }),
        ])
        toast.success(
          `Deleted ${transactions.length} Transaction${transactions.length === 1 ? ` - ${transactions[0]!.description}` : 's'}`,
        )
        // refresh page if needed
        if (refreshOnSuccess) router.refresh()
      },
      onError(error) {
        toast.error(`Error deleting Transactions`, {
          description: error.message,
        })
      },
    }),
  )
  return (
    <AlertActionButton
      alertTitle="Delete Transactions"
      alertDescription={`This will permanently delete the ${transactions.length} selected transaction${transactions.length === 1 ? '' : 's'}. This cannot be undone!`}
      onConfirm={() =>
        deleteTransactions.mutate(transactions.map((t) => ({ id: t.id })))
      }
      {...props}
      asChild>
      {trigger}
    </AlertActionButton>
  )
}

export { DeleteSelectedTransactionsDialog }
