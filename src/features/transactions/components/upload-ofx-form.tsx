'use client'

import { useQuery } from '@tanstack/react-query'
import { type ComponentProps } from 'react'
import type { z } from 'zod'

import { useAppForm } from '~/hooks/use-app-form'
import { cn } from '~/lib/utils'
import { api } from '~/rpc/client'
import { UploadOFXFormSchema } from '../validators'

type UploadOFXFormProps = Omit<ComponentProps<'form'>, 'onSubmit'> & {
  onSubmit?: (value: z.infer<typeof UploadOFXFormSchema>) => void
}

function UploadOFXForm({ className, onSubmit, ...props }: UploadOFXFormProps) {
  const form = useAppForm({
    defaultValues: {} as z.infer<typeof UploadOFXFormSchema>,
    validators: {
      onSubmit: UploadOFXFormSchema,
    },
    onSubmit({ value }) {
      onSubmit?.(value)
    },
  })

  const accounts = useQuery(
    api.bankAccounts.getAll.queryOptions({
      select: (data) => data.map((acc) => ({ value: acc.id, label: acc.name })),
    }),
  )

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
          <field.SelectField
            label="Account"
            data={accounts.promise}
            placeholder="Select an account"
          />
        )}
      </form.AppField>

      <form.AppField name="file">
        {(field) => <field.FileField accept=".ofx,.qfx" label="File" />}
      </form.AppField>
    </form>
  )
}

export { UploadOFXForm }
