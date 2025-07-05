'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useId, useRef, useState, type ReactNode } from 'react'
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { DialogDrawer, DialogDrawerClose } from '~/components/ui/dialog-drawer'
import { ProgressButton } from '~/components/ui/progress-button'
import { api } from '~/rpc/client'
import { BudgetForm, type BudgetFormHandle } from './budget-form'

interface CreateBudgetDialogProps {
  trigger: ReactNode
  refreshOnSuccess?: boolean
}

export function CreateBudgetDialog({
  trigger,
  refreshOnSuccess,
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

  return (
    <DialogDrawer
      open={open}
      onOpenChange={setOpen}
      title="Create budget"
      description="Enter the details of the budget"
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
            isLoading={createBudget.isPending}>
            Create
          </ProgressButton>
        </>
      }>
      <BudgetForm id={formId} ref={formRef} onSubmit={createBudget.mutate} />
    </DialogDrawer>
  )
}
