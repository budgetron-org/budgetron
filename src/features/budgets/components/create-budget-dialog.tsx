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
import { api } from '~/rpc/client'
import { BudgetForm, type BudgetFormHandle } from './budget-form'

interface CreateBudgetDialogProps extends ComponentProps<typeof Dialog> {
  trigger: ReactNode
  refreshOnSuccess?: boolean
}

export function CreateBudgetDialog({
  trigger,
  refreshOnSuccess,
  ...props
}: CreateBudgetDialogProps) {
  const formRef = useRef<BudgetFormHandle>(null)
  const formId = useId()
  const checkboxId = useId()
  const [open, setOpen] = useState(false)
  const [willCreateAnother, setWillCreateAnother] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const createBudget = useMutation(
    api.budgets.create.mutationOptions({
      async onSuccess() {
        // invalidate account queries
        await queryClient.invalidateQueries({
          queryKey: api.budgets.key(),
        })
        if (!willCreateAnother) setOpen(false)
        formRef.current?.reset()
        toast.success(`Created new budget.`)
        // refresh page if needed
        if (refreshOnSuccess) router.refresh()
      },
      onError(error) {
        toast.error(`Error creating budget`, {
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
          <DialogTitle>Create budget</DialogTitle>
          <DialogDescription>Enter the details of the budget</DialogDescription>
        </DialogHeader>

        <BudgetForm id={formId} ref={formRef} onSubmit={createBudget.mutate} />

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
            isLoading={createBudget.isPending}>
            Create
          </ProgressButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
