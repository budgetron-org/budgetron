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
import {
  BankAccountForm,
  type BankAccountFormHandle,
} from './bank-account-form'

type CreateBankAccountDialogProps = ComponentProps<typeof Dialog> & {
  refreshOnSuccess?: boolean
  trigger: ReactNode
}

export function CreateBankAccountDialog({
  refreshOnSuccess,
  trigger,
  ...props
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
      onSuccess(_, { name }) {
        toast.success(`Created Bank Account - ${name}`)
        if (!willCreateAnother) setOpen(false)
        formRef.current?.reset()
        // invalidate account queries
        queryClient.invalidateQueries({
          queryKey: api.bankAccounts.getAll.key(),
        })
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

  const closeDialog = useCallback(() => setOpen(false), [])
  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open)
  }, [])

  return (
    <Dialog {...props} open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Bank account</DialogTitle>
          <DialogDescription>
            Enter the details of the bank account
          </DialogDescription>
        </DialogHeader>

        <BankAccountForm
          id={formId}
          ref={formRef}
          onSubmit={createBankAccount.mutate}
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
            isLoading={createBankAccount.isPending}>
            Create
          </ProgressButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
