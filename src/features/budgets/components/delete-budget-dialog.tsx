'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import type { ComponentProps, ReactNode } from 'react'
import { toast } from 'sonner'

import { AlertActionButton } from '~/components/ui/alert-action-button'
import { api } from '~/rpc/client'
import type { Budget } from '../types'

interface DeleteBudgetDialogProps
  extends ComponentProps<typeof AlertActionButton> {
  budget: Pick<Budget, 'id'>
  refreshOnSuccess?: boolean
  trigger: ReactNode
}

function DeleteBudgetDialog({
  budget,
  refreshOnSuccess,
  trigger,
  ...props
}: DeleteBudgetDialogProps) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const deleteBudget = useMutation(
    api.budgets.delete.mutationOptions({
      onSuccess() {
        toast.success(`Deleted Budget`)
        // invalidate account queries
        queryClient.invalidateQueries({
          queryKey: api.budgets.key(),
        })
        // refresh page if needed
        if (refreshOnSuccess) router.refresh()
      },
      onError(error) {
        toast.error(`Error deleting Budget`, {
          description: error.message,
        })
      },
    }),
  )
  return (
    <AlertActionButton
      alertDescription={`This will delete the budget. This cannot be undone!`}
      onConfirm={() => deleteBudget.mutate({ id: budget.id })}
      {...props}
      asChild>
      {trigger}
    </AlertActionButton>
  )
}

export { DeleteBudgetDialog }
