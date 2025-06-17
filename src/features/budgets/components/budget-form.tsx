'use client'

import {
  useImperativeHandle,
  type ComponentPropsWithoutRef,
  type Ref,
} from 'react'
import type { z } from 'zod/v4'

import { useAppForm } from '~/hooks/use-app-form'
import { cn } from '~/lib/utils'
import { BudgetFormSchema } from '../validators'

interface BudgetFormHandle {
  reset: () => void
}

interface BudgetFormProps
  extends Omit<ComponentPropsWithoutRef<'form'>, 'defaultValue' | 'onSubmit'> {
  defaultValues?: z.infer<typeof BudgetFormSchema>
  ref?: Ref<BudgetFormHandle>
  onSubmit?: (value: z.infer<typeof BudgetFormSchema>) => void
}

const DEFAULT_VALUES = {
  amount: '',
  categoryId: '',
} as const satisfies z.infer<typeof BudgetFormSchema>

function BudgetForm({
  className,
  defaultValues = DEFAULT_VALUES,
  ref,
  onSubmit,
  ...props
}: BudgetFormProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: BudgetFormSchema,
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
      <form.AppField name="categoryId">
        {(field) => (
          <field.CategoryField
            label="Category"
            placeholder="Select a category"
            type="EXPENSE"
          />
        )}
      </form.AppField>

      <form.AppField name="amount">
        {(field) => <field.TextField label="Spend per month" type="number" />}
      </form.AppField>
    </form>
  )
}

export { BudgetForm }
export type { BudgetFormHandle }
