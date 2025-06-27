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
import {
  TransactionForm,
  type TransactionFormHandle,
} from '~/features/transactions/components/transaction-form'
import { api } from '~/rpc/client'
import type { Transaction } from '../types'

interface UpdateTransactionDialogProps extends ComponentProps<typeof Dialog> {
  transaction: Transaction
  refreshOnSuccess?: boolean
  trigger: ReactNode
}

export function UpdateTransactionDialog({
  refreshOnSuccess,
  transaction,
  trigger,
  ...props
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

  const closeDialog = useCallback(() => setOpen(false), [])
  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open)
  }, [])

  return (
    <Dialog {...props} open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update transaction</DialogTitle>
          <DialogDescription>
            Enter the new details of the transaction
          </DialogDescription>
        </DialogHeader>

        <TransactionForm
          id={formId}
          ref={formRef}
          defaultValues={transaction}
          onSubmit={(data) =>
            updateTransaction.mutate({ ...data, id: transaction.id })
          }
        />

        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <ProgressButton
            form={formId}
            type="submit"
            isLoading={updateTransaction.isPending}>
            Update
          </ProgressButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
