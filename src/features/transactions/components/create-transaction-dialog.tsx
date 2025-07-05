'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useId, useRef, useState, type ReactNode } from 'react'
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { DialogDrawer, DialogDrawerClose } from '~/components/ui/dialog-drawer'
import { ProgressButton } from '~/components/ui/progress-button'
import {
  TransactionForm,
  type TransactionFormHandle,
} from '~/features/transactions/components/transaction-form'
import { api } from '~/rpc/client'

interface CreateTransactionDialogProps {
  trigger: ReactNode
}

export function CreateTransactionDialog({
  trigger,
}: CreateTransactionDialogProps) {
  const formRef = useRef<TransactionFormHandle>(null)
  const formId = useId()
  const checkboxId = useId()
  const [open, setOpen] = useState(false)
  const [willCreateAnother, setWillCreateAnother] = useState(false)
  const queryClient = useQueryClient()

  const createTransaction = useMutation(
    api.transactions.create.mutationOptions({
      async onSuccess(_, { description }) {
        // invalidate transaction & analytics queries
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: api.transactions.key(),
          }),
          queryClient.invalidateQueries({
            queryKey: api.analytics.key(),
          }),
        ])
        if (!willCreateAnother) setOpen(false)
        formRef.current?.reset()
        toast.success(`Created transaction - ${description}`)
      },
      onError(error, { description }) {
        toast.error(`Error creating transaction - ${description}`, {
          description: error.message,
        })
      },
    }),
  )

  return (
    <DialogDrawer
      open={open}
      onOpenChange={setOpen}
      title="Create transaction"
      description="Enter the details of the transaction"
      trigger={trigger}
      footer={
        <>
          <div className="mr-auto flex items-center gap-2">
            <Checkbox
              id={checkboxId}
              checked={willCreateAnother}
              onCheckedChange={(checked) =>
                setWillCreateAnother(Boolean(checked))
              }
            />
            <label htmlFor={checkboxId}>Create another</label>
          </div>

          <DialogDrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogDrawerClose>
          <ProgressButton
            form={formId}
            type="submit"
            isLoading={createTransaction.isPending}>
            Create
          </ProgressButton>
        </>
      }>
      <div className="overflow-y-auto">
        <TransactionForm
          id={formId}
          ref={formRef}
          onSubmit={createTransaction.mutate}
        />
      </div>
    </DialogDrawer>
  )
}
