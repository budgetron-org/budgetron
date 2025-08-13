'use client'

import {
  useImperativeHandle,
  type ComponentPropsWithoutRef,
  type Ref,
} from 'react'
import type { z } from 'zod/v4'

import { TransactionFormSchema } from '~/features/transactions/validators'
import { useAppForm } from '~/hooks/use-app-form'
import { cn } from '~/lib/utils'

interface TransactionFormHandle {
  reset: () => void
}

interface TransactionFormProps
  extends Omit<ComponentPropsWithoutRef<'form'>, 'defaultValue' | 'onSubmit'> {
  defaultValues?: z.infer<typeof TransactionFormSchema>
  ref?: Ref<TransactionFormHandle>
  onSubmit?: (value: z.infer<typeof TransactionFormSchema>) => void
}

const DEFAULT_VALUES = {
  amount: '',
  currency: 'USD',
  date: new Date(),
  description: '',
  bankAccountId: null,
  categoryId: null,
  type: 'EXPENSE',
  fromBankAccountId: null,
  toBankAccountId: null,
  notes: '',
  tags: [],
} as const satisfies z.infer<typeof TransactionFormSchema>

function TransactionForm({
  className,
  defaultValues = DEFAULT_VALUES,
  ref,
  onSubmit,
  ...props
}: TransactionFormProps) {
  const form = useAppForm({
    defaultValues,
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
      className={cn('grid grid-cols-1 gap-4 md:grid-cols-6', className)}
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}>
      <form.AppField name="description">
        {(field) => (
          <field.TextField label="Description" className="md:col-span-6" />
        )}
      </form.AppField>

      <form.Subscribe selector={(state) => state.values.bankAccountId}>
        {(bankAccountId) => (
          <form.AppField name="currency">
            {(field) => (
              <field.CurrencyField
                label="Currency"
                className="md:col-span-2"
                disabled={bankAccountId != null}
              />
            )}
          </form.AppField>
        )}
      </form.Subscribe>

      <form.AppField name="amount">
        {(field) => (
          <field.TextField
            label="Amount"
            type="number"
            className="md:col-span-2"
          />
        )}
      </form.AppField>

      <form.AppField name="date">
        {(field) => <field.DateField label="Date" className="md:col-span-2" />}
      </form.AppField>

      <form.AppField
        name="bankAccountId"
        listeners={{
          onChange({ fieldApi, value }) {
            if (!value) return
            fieldApi.form.setFieldValue('currency', 'INR')
          },
        }}>
        {(field) => (
          <field.BankAccountField
            label="Account"
            className="md:col-span-3"
            placeholder="Select an account"
          />
        )}
      </form.AppField>

      <form.AppField
        name="type"
        listeners={{
          onChange({ fieldApi }) {
            // clear category value on type change
            fieldApi.form.setFieldValue('categoryId', null)
          },
        }}>
        {(field) => (
          <field.TransactionTypeField
            label="Type"
            className="md:col-span-3"
            placeholder="Select a type"
          />
        )}
      </form.AppField>

      <form.Subscribe selector={(state) => state.values.type}>
        {(type) => (
          <>
            {type === 'TRANSFER' && (
              <>
                <form.AppField name="fromBankAccountId">
                  {(field) => (
                    <field.BankAccountField
                      label="From Account"
                      className="md:col-span-3"
                      placeholder="Select an account"
                    />
                  )}
                </form.AppField>
                <form.AppField name="toBankAccountId">
                  {(field) => (
                    <field.BankAccountField
                      label="To Account"
                      className="md:col-span-3"
                      placeholder="Select an account"
                    />
                  )}
                </form.AppField>
              </>
            )}
            <form.AppField name="categoryId">
              {(field) => (
                <field.CategoryField
                  label="Category"
                  className="md:col-span-6"
                  placeholder="Select a category"
                  type={type}
                />
              )}
            </form.AppField>
          </>
        )}
      </form.Subscribe>

      <form.AppField name="notes">
        {(field) => (
          <field.TextareaField label="Notes" className="md:col-span-6" />
        )}
      </form.AppField>

      <form.AppField name="tags">
        {(field) => (
          <field.TagsInputField label="Tags" className="md:col-span-6" />
        )}
      </form.AppField>
    </form>
  )
}

export { TransactionForm }
export type { TransactionFormHandle }
