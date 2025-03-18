'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { createHousehold } from '@/actions/household'
import { CreateHouseholdForm } from '@/components/create-household-form'
import { CURRENCIES } from '@/data/currencies'
import { CreateHouseholdSchema } from '@/schemas/household'

export function SetupForm() {
  const router = useRouter()

  // save on form submit
  const submitMutation = useMutation({
    mutationFn: createHousehold,
    onMutate() {
      toast.loading('Creating your first household...', {
        id: 'create-household',
      })
    },
    onSuccess() {
      toast.success('New household created!', {
        id: 'create-household',
      })
      router.replace('/dashboard')
    },
    onError() {
      toast.error(
        'Something went wrong when creating the household. Please try again',
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

  const onSubmit = useCallback<
    SubmitHandler<z.infer<typeof CreateHouseholdSchema>>
  >(
    ({ icon, name, currency }) => {
      // Make API calls to save household and currency
      submitMutation.mutate({ icon, name, currency })
    },
    [submitMutation],
  )

  const onCancel = useCallback(() => {
    router.replace('/dashboard')
  }, [router])

  return (
    <CreateHouseholdForm
      form={form}
      isSubmissionDisabled={submitMutation.isPending}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitButtonLabel="Save and continue"
      cancelButtonLabel="Skip for now"
    />
  )
}
