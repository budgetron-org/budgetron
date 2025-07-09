'use client'

import {
  useImperativeHandle,
  type ComponentPropsWithoutRef,
  type Ref,
} from 'react'
import type { z } from 'zod/v4'

import { useAppForm } from '~/hooks/use-app-form'
import { cn } from '~/lib/utils'
import { BankAccountFormSchema } from '../validators'

type BankAccountFormHandle = {
  reset: () => void
}

interface BankAccountFormProps
  extends Omit<ComponentPropsWithoutRef<'form'>, 'defaultValue' | 'onSubmit'> {
  defaultValues?: z.infer<typeof BankAccountFormSchema>
  hiddenFields?: Extract<
    keyof z.infer<typeof BankAccountFormSchema>,
    'currency'
  >[]
  ref?: Ref<BankAccountFormHandle>
  onSubmit?: (value: z.infer<typeof BankAccountFormSchema>) => void
}

const DEFAULT_VALUES = {
  name: '',
  type: 'CHECKING',
  currency: 'USD',
  balance: '0.00',
} as z.infer<typeof BankAccountFormSchema>

function BankAccountForm({
  className,
  defaultValues = DEFAULT_VALUES,
  hiddenFields,
  ref,
  onSubmit,
  ...props
}: BankAccountFormProps) {
  const form = useAppForm({
    defaultValues: defaultValues,
    validators: {
      onSubmit: BankAccountFormSchema,
    },
    onSubmit({ value }) {
      onSubmit?.(value)
    },
  })

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        form.reset()
      },
    }),
    [form],
  )

  return (
    <form
      {...props}
      className={cn('grid grid-cols-1 gap-4 md:grid-cols-2', className)}
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}>
      <form.AppField name="name">
        {(field) => <field.TextField label="Name" className="md:col-span-2" />}
      </form.AppField>

      <form.AppField name="type">
        {(field) => <field.BankAccountTypeField label="Type" />}
      </form.AppField>

      {!hiddenFields?.includes('currency') && (
        <form.AppField name="currency">
          {(field) => <field.CurrencyField label="Currency" />}
        </form.AppField>
      )}

      <form.AppField name="balance">
        {(field) => <field.TextField label="Balance" />}
      </form.AppField>
    </form>
  )
}

export { BankAccountForm }
export type { BankAccountFormHandle }
