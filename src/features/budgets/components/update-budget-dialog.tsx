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
import { api } from '~/rpc/client'
import type { Budget } from '../types'
import { BudgetForm, type BudgetFormHandle } from './budget-form'

interface UpdateBudgetDialogProps extends ComponentProps<typeof Dialog> {
  budget: Pick<Budget, 'id' | 'categoryId' | 'amount'>
  refreshOnSuccess?: boolean
  trigger: ReactNode
}

export function UpdateBudgetDialog({
  budget,
  refreshOnSuccess,
  trigger,
  ...props
}: UpdateBudgetDialogProps) {
  const formRef = useRef<BudgetFormHandle>(null)
  const formId = useId()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const updateBudget = useMutation(
    api.budgets.update.mutationOptions({
      async onSuccess() {
        // invalidate account queries
        await queryClient.invalidateQueries({
          queryKey: api.budgets.key(),
        })
        formRef.current?.reset()
        setOpen(false)
        toast.success(`Updated Budget`)
        // refresh page if needed
        if (refreshOnSuccess) router.refresh()
      },
      onError(error) {
        toast.error(`Error updating Budget`, {
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
          <DialogTitle>Update Budget</DialogTitle>
          <DialogDescription>
            Enter the new details of the budget
          </DialogDescription>
        </DialogHeader>

        <BudgetForm
          id={formId}
          ref={formRef}
          defaultValues={budget}
          onSubmit={(data) => updateBudget.mutate({ ...data, id: budget.id })}
        />

        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <ProgressButton
            form={formId}
            type="submit"
            isLoading={updateBudget.isPending}>
            Update
          </ProgressButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
