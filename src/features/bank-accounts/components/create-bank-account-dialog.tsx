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
import {
  BankAccountForm,
  type BankAccountFormHandle,
} from './bank-account-form'

interface CreateBankAccountDialogProps {
  refreshOnSuccess?: boolean
  trigger: ReactNode
}

export function CreateBankAccountDialog({
  refreshOnSuccess,
  trigger,
}: CreateBankAccountDialogProps) {
  const formRef = useRef<BankAccountFormHandle>(null)
  const formId = useId()
  const checkboxId = useId()
  const [open, setOpen] = useState(false)
  const [willCreateAnother, setWillCreateAnother] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const createBankAccount = useMutation(
    api.bankAccounts.create.mutationOptions({
      async onSuccess(_, { name }) {
        // invalidate account queries
        await queryClient.invalidateQueries({
          queryKey: api.bankAccounts.getAll.key(),
        })

        if (!willCreateAnother) setOpen(false)
        formRef.current?.reset()

        toast.success(`Created Bank Account - ${name}`)
        // refresh page if needed
        if (refreshOnSuccess) router.refresh()
      },
      onError(error, { name }) {
        toast.error(`Error creating Bank Account - ${name}`, {
          description: error.message,
        })
      },
    }),
  )

  return (
    <DialogDrawer
      open={open}
      onOpenChange={setOpen}
      title="Create Bank account"
      description="Enter the details of the bank account"
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
            isLoading={createBankAccount.isPending}>
            Create
          </ProgressButton>
        </>
      }>
      <BankAccountForm
        id={formId}
        ref={formRef}
        onSubmit={createBankAccount.mutate}
      />
    </DialogDrawer>
  )
}
