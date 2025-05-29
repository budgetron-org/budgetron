'use client'

import { type ComponentProps } from 'react'
import type { z } from 'zod'

import { useAppForm } from '~/hooks/use-app-form'
import { cn } from '~/lib/utils'
import { UploadOFXFormSchema } from '../validators'

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
      onSubmit?.(value)
    },
  })

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
          <field.CheckboxField label="Auto-categorize transactions" />
        )}
      </form.AppField>
    </form>
  )
}

export { UploadOFXForm }
