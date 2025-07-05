'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useId, useRef, useState, type ReactNode } from 'react'
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { DialogDrawer, DialogDrawerClose } from '~/components/ui/dialog-drawer'
import { ProgressButton } from '~/components/ui/progress-button'
import {
  TransactionForm,
  type TransactionFormHandle,
} from '~/features/transactions/components/transaction-form'
import { api } from '~/rpc/client'
import type { Transaction } from '../types'

interface UpdateTransactionDialogProps {
  transaction: Transaction
  refreshOnSuccess?: boolean
  trigger: ReactNode
}

export function UpdateTransactionDialog({
  refreshOnSuccess,
  transaction,
  trigger,
}: UpdateTransactionDialogProps) {
  const formRef = useRef<TransactionFormHandle>(null)
  const formId = useId()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const updateTransaction = useMutation(
    api.transactions.update.mutationOptions({
      async onSuccess({ description }) {
        // invalidate transaction & analytics queries
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: api.transactions.key(),
          }),
          queryClient.invalidateQueries({
            queryKey: api.analytics.key(),
          }),
        ])
        formRef.current?.reset()
        setOpen(false)
        toast.success(
          `Updated Transaction - ${transaction.description}${transaction.description !== description ? ` to ${description}` : ''}`,
        )
        // refresh page if needed
        if (refreshOnSuccess) router.refresh()
      },
      onError(error) {
        toast.error(`Error updating Transaction - ${transaction.description}`, {
          description: error.message,
        })
      },
    }),
  )

  return (
    <DialogDrawer
      open={open}
      onOpenChange={setOpen}
      title="Update transaction"
      description="Enter the new details of the transaction"
      trigger={trigger}
      footer={
        <>
          <DialogDrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogDrawerClose>
          <ProgressButton
            form={formId}
            type="submit"
            isLoading={updateTransaction.isPending}>
            Update
          </ProgressButton>
        </>
      }>
      <div className="overflow-y-auto">
        <TransactionForm
          id={formId}
          ref={formRef}
          defaultValues={transaction}
          onSubmit={(data) =>
            updateTransaction.mutate({ ...data, id: transaction.id })
          }
        />
      </div>
    </DialogDrawer>
  )
}
