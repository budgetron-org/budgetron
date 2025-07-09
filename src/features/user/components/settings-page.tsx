'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { z } from 'zod/v4'

import { SkeletonWrapper } from '~/components/ui/skeleton-wrapper'
import { useAppForm } from '~/hooks/use-app-form'
import { api } from '~/rpc/client'
import { UpdateCurrencyFormSchema } from '../validators'
import { AccountPageContainer } from './account-page-container'
import { AccountPageSection } from './account-page-section'

function CurrencySection() {
  const queryClient = useQueryClient()
  const userSettings = useQuery(api.user.getUserSettings.queryOptions())
  const updateCurrency = useMutation(
    api.user.updateCurrency.mutationOptions({
      async onSuccess() {
        toast.success('Currency updated successfully')
        await queryClient.invalidateQueries({
          queryKey: api.user.getUserSettings.key(),
        })
      },
      onError(error) {
        toast.error('Failed to update currency', {
          description: error.message,
        })
      },
    }),
  )
  const form = useAppForm({
    defaultValues: {
      currency: userSettings.data?.currency ?? '',
    } as z.infer<typeof UpdateCurrencyFormSchema>,
    validators: {
      onSubmit: UpdateCurrencyFormSchema,
    },
    onSubmit: ({ value }) => {
      updateCurrency.mutate(value)
    },
  })

  return (
    <AccountPageSection
      title="Currency"
      description="Set your default currency for the future transactions."
      footer={
        <form.AppForm>
          <form.SubmitButton
            className="w-max"
            isLoading={updateCurrency.isPending}
            submitOnClick>
            Save
          </form.SubmitButton>
        </form.AppForm>
      }>
      <form
        className="grid max-w-lg grid-cols-1 gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}>
        <SkeletonWrapper isLoading={userSettings.isPending}>
          <form.AppField name="currency">
            {(field) => <field.CurrencyField label="Currency" />}
          </form.AppField>
        </SkeletonWrapper>
      </form>
    </AccountPageSection>
  )
}

function SettingsPage() {
  return (
    <AccountPageContainer>
      <CurrencySection />
    </AccountPageContainer>
  )
}

export { SettingsPage }
