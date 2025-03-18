'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LoaderCircleIcon } from 'lucide-react'
import {
  useCallback,
  useId,
  useMemo,
  type ComponentProps,
  type ReactNode,
} from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { createHousehold } from '@/actions/household'
import { CreateHouseholdForm } from '@/components/create-household-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CURRENCIES } from '@/data/currencies'
import { CreateHouseholdSchema } from '@/schemas/household'

type CreateHouseholdDialogProps = ComponentProps<typeof Dialog> & {
  onCancel?: () => void
  onSuccess?: () => void
  trigger: ReactNode
}

export function CreateHouseholdDialog({
  trigger,
  onCancel,
  onSuccess,
  ...props
}: CreateHouseholdDialogProps) {
  const formId = useId()
  const queryClient = useQueryClient()
  // save on form submit
  const submitMutation = useMutation({
    mutationFn: createHousehold,
    onMutate() {
      toast.loading('Creating household...', {
        id: 'create-household',
      })
    },
    onSuccess() {
      toast.success('New household created!', {
        id: 'create-household',
      })
      queryClient.invalidateQueries({
        queryKey: ['households'],
      })
      onSuccess?.()
    },
    onError() {
      toast.error(
        'Something went wrong when creating the household. Please try again.',
        { id: 'create-household' },
      )
    },
  })

  const form = useForm<z.infer<typeof CreateHouseholdSchema>>({
    resolver: zodResolver(CreateHouseholdSchema),
    defaultValues: {
      icon: 'home',
      name: '',
      currency: CURRENCIES[0].code,
    },
    reValidateMode: 'onBlur',
  })

  const isSubmissionDisabled = useMemo(
    () => submitMutation.isPending,
    [submitMutation.isPending],
  )

  const onSubmit = useCallback<
    SubmitHandler<z.infer<typeof CreateHouseholdSchema>>
  >(
    ({ icon, name, currency }) => {
      // Make API calls to save household and currency
      submitMutation.mutate({ icon, name, currency })
    },
    [submitMutation],
  )

  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create household</DialogTitle>
          <DialogDescription>
            Add a new household to manage expenses.
          </DialogDescription>
        </DialogHeader>

        <CreateHouseholdForm
          id={formId}
          form={form}
          isSubmissionDisabled={isSubmissionDisabled}
          onSubmit={onSubmit}
          onCancel={onCancel}
          hasCustomFooterButtons
        />

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button form={formId} type="submit" disabled={isSubmissionDisabled}>
            {isSubmissionDisabled ? <LoaderCircleIcon /> : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
