'use client'

import { type ComponentProps } from 'react'
import type { z } from 'zod/v4'

import { useAppForm } from '~/hooks/use-app-form'
import { cn } from '~/lib/utils'
import { UploadOFXFormSchema } from '../validators'
import { useQuery } from '@tanstack/react-query'
import { api } from '~/rpc/client'
import { SkeletonWrapper } from '~/components/ui/skeleton-wrapper'
import { Badge } from '~/components/ui/badge'

interface UploadOFXFormProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  onSubmit?: (value: z.infer<typeof UploadOFXFormSchema>) => void
}

function UploadOFXForm({ className, onSubmit, ...props }: UploadOFXFormProps) {
  const form = useAppForm({
    defaultValues: {
      shouldAutoCategorize: false,
    } as z.infer<typeof UploadOFXFormSchema>,
    validators: {
      onSubmit: UploadOFXFormSchema,
    },
    onSubmit({ value }) {
      onSubmit?.({
        ...value,
        // only allow categorization if AI is healthy
        shouldAutoCategorize:
          aiHealth.data === true ? value.shouldAutoCategorize : false,
      })
    },
  })

  const aiHealth = useQuery(api.ai.health.queryOptions())

  return (
    <form
      {...props}
      className={cn('grid grid-cols-1 gap-4 md:grid-cols-2', className)}
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}>
      <form.AppField name="bankAccountId">
        {(field) => (
          <field.BankAccountField
            label="Account"
            placeholder="Select an account"
          />
        )}
      </form.AppField>

      <form.AppField name="files">
        {(field) => (
          <field.FileField accept=".ofx,.qfx" label="Files" multiple />
        )}
      </form.AppField>

      <form.AppField name="shouldAutoCategorize">
        {(field) => (
          <SkeletonWrapper isLoading={aiHealth.isPending}>
            <div className="flex items-center gap-2">
              <field.CheckboxField
                label="Auto-categorize transactions"
                disabled={aiHealth.data === false}
              />
              {aiHealth.data === false && (
                <Badge variant="destructive">SERVICE DOWN</Badge>
              )}
            </div>
          </SkeletonWrapper>
        )}
      </form.AppField>
    </form>
  )
}

export { UploadOFXForm }
