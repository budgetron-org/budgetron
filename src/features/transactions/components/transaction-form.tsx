'use client'

import {
  useImperativeHandle,
  type ComponentPropsWithoutRef,
  type Ref,
} from 'react'
import type { z } from 'zod'

import { useAppForm } from '~/hooks/use-app-form'
import { cn } from '~/lib/utils'
import { TransactionFormSchema } from '../validators'

type TransactionFormHandle = {
  reset: () => void
}

type TransactionFormProps = Omit<
  ComponentPropsWithoutRef<'form'>,
  'onSubmit'
> & {
  ref?: Ref<TransactionFormHandle>
  onSubmit?: (value: z.infer<typeof TransactionFormSchema>) => void
}

function TransactionForm({
  className,
  ref,
  onSubmit,
  ...props
}: TransactionFormProps) {
  const form = useAppForm({
    defaultValues: {
      amount: '',
      currency: 'USD',
      date: new Date(),
      description: '',
      bankAccountId: '',
      categoryId: '',
      type: 'expense',
    } as z.infer<typeof TransactionFormSchema>,
    validators: {
      onSubmit: TransactionFormSchema,
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
      <form.AppField name="description">
        {(field) => (
          <field.TextField label="Description" className="md:col-span-2" />
        )}
      </form.AppField>

      <form.AppField name="amount">
        {(field) => <field.TextField label="Amount" type="number" />}
      </form.AppField>

      <form.AppField name="date">
        {(field) => <field.DateField label="Date" />}
      </form.AppField>

      <form.AppField name="type">
        {(field) => <field.TransactionTypeField label="Type" />}
      </form.AppField>

      <form.AppField name="categoryId">
        {(field) => (
          <field.CategoryField
            label="Category"
            placeholder="Select a category"
          />
        )}
      </form.AppField>

      <form.AppField name="bankAccountId">
        {(field) => (
          <field.BankAccountField
            label="Account"
            placeholder="Select an account"
          />
        )}
      </form.AppField>
    </form>
  )
}

export { TransactionForm }
export type { TransactionFormHandle }
