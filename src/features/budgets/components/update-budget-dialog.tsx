'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useId, useRef, useState, type ReactNode } from 'react'
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { DialogDrawer, DialogDrawerClose } from '~/components/ui/dialog-drawer'
import { ProgressButton } from '~/components/ui/progress-button'
import { api } from '~/rpc/client'
import type { Budget } from '../types'
import { BudgetForm, type BudgetFormHandle } from './budget-form'

interface UpdateBudgetDialogProps {
  budget: Pick<Budget, 'id' | 'categoryId' | 'amount'>
  refreshOnSuccess?: boolean
  trigger: ReactNode
}

export function UpdateBudgetDialog({
  budget,
  refreshOnSuccess,
  trigger,
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

  return (
    <DialogDrawer
      open={open}
      onOpenChange={setOpen}
      title="Update budget"
      description="Enter the new details of the budget"
      trigger={trigger}
      footer={
        <>
          <DialogDrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogDrawerClose>
          <ProgressButton
            form={formId}
            type="submit"
            isLoading={updateBudget.isPending}>
            Update
          </ProgressButton>
        </>
      }>
      <BudgetForm
        id={formId}
        ref={formRef}
        defaultValues={budget}
        onSubmit={(data) => updateBudget.mutate({ ...data, id: budget.id })}
      />
    </DialogDrawer>
  )
}
