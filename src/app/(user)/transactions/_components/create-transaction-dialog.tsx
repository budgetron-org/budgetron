'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LoaderCircleIcon } from 'lucide-react'
import {
  useCallback,
  useId,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

import { createTransaction } from '@/actions/transaction'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CreateTransactionSchemaWithoutUser } from '@/schemas/transaction'
import { CreateEditTransactionForm } from './create-edit-transaction-form'

type CreateTransactionDialogProps = ComponentProps<typeof Dialog> & {
  trigger: ReactNode
}

export function CreateTransactionDialog({
  trigger,
  ...props
}: CreateTransactionDialogProps) {
  const formId = useId()
  const checkboxId = useId()
  const [open, setOpen] = useState(false)
  const [willCreateAnother, setWillCreateAnother] = useState(false)
  const form = useForm<z.infer<typeof CreateTransactionSchemaWithoutUser>>({
    resolver: zodResolver(CreateTransactionSchemaWithoutUser),
    defaultValues: {
      amount: '',
      date: new Date(),
      description: '',
      householdId: null,
      type: 'expense',
    },
  })

  const queryClient = useQueryClient()

  const submitTransaction = useMutation({
    mutationFn: createTransaction,
    onMutate() {
      toast.loading('Creating transaction...', {
        id: 'create-transaction',
      })
    },
    async onSuccess() {
      toast.success('New transaction created!', {
        id: 'create-transaction',
      })
      await queryClient.invalidateQueries({ queryKey: 'transactions' })
      form.reset()
      if (!willCreateAnother) setOpen(false)
    },
    onError() {
      toast.error(
        'Something went wrong when creating the transaction. Please try again.',
        { id: 'create-transaction' },
      )
    },
  })

  const closeDialog = useCallback(() => setOpen(false), [])
  const onOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open)
      if (!open) form.reset()
    },
    [form],
  )
  const onSubmit = useCallback<
    SubmitHandler<z.infer<typeof CreateTransactionSchemaWithoutUser>>
  >(
    (form) => {
      submitTransaction.mutate(form)
    },
    [submitTransaction],
  )

  return (
    <Dialog {...props} open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create transaction</DialogTitle>
          <DialogDescription>Add a new transaction</DialogDescription>
        </DialogHeader>

        <CreateEditTransactionForm
          id={formId}
          form={form}
          onSubmit={onSubmit}
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
          <Button
            form={formId}
            type="submit"
            disabled={submitTransaction.isPending}>
            {submitTransaction.isPending ? <LoaderCircleIcon /> : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
