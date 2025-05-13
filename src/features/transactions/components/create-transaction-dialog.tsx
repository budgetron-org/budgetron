'use client'

import { useMutation } from '@tanstack/react-query'
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
import { Checkbox } from '~/components/ui/checkbox'
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

type CreateTransactionDialogProps = ComponentProps<typeof Dialog> & {
  trigger: ReactNode
}

export function CreateTransactionDialog({
  trigger,
  ...props
}: CreateTransactionDialogProps) {
  const formRef = useRef<TransactionFormHandle>(null)
  const formId = useId()
  const checkboxId = useId()
  const [open, setOpen] = useState(false)
  const [willCreateAnother, setWillCreateAnother] = useState(false)

  const createTransaction = useMutation(
    api.transactions.create.mutationOptions({
      onSuccess(_, { description }) {
        toast.success(`Created transaction - ${description}`)
        if (!willCreateAnother) setOpen(false)
        formRef.current?.reset()
      },
      onError(error, { description }) {
        toast.error(`Error creating transaction - ${description}`, {
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
          <DialogTitle>Create transaction</DialogTitle>
          <DialogDescription>
            Enter the details of the transaction
          </DialogDescription>
        </DialogHeader>

        <TransactionForm
          id={formId}
          ref={formRef}
          onSubmit={createTransaction.mutate}
        />

        <DialogFooter>
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

          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <ProgressButton
            form={formId}
            type="submit"
            isLoading={createTransaction.isPending}>
            Create
          </ProgressButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
