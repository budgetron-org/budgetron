'use client'

import {
  useImperativeHandle,
  type ComponentPropsWithoutRef,
  type Ref,
} from 'react'
import type { z } from 'zod'

import { useAppForm } from '~/hooks/use-app-form'
import { AccountFormSchema } from '../validators'
import { cn } from '~/lib/utils'

const DEFAULT_VALUES = {
  firstName: '',
  lastName: '',
  email: '',
  image: '',
} as z.infer<typeof AccountFormSchema>

type AccountFormHandle = {
  reset: () => void
}

type AccountFormProps = Omit<
  ComponentPropsWithoutRef<'form'>,
  'defaultValue' | 'onSubmit'
> & {
  defaultValues?: z.infer<typeof AccountFormSchema>
  ref?: Ref<AccountFormHandle>
  onSubmit?: (value: z.infer<typeof AccountFormSchema>) => void
}

function AccountForm({
  defaultValues = DEFAULT_VALUES,
  ref,
  onSubmit,
  className,
  ...props
}: AccountFormProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: AccountFormSchema,
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
      <form.AppField name="firstName">
        {(field) => <field.TextField label="First Name" />}
      </form.AppField>

      <form.AppField name="lastName">
        {(field) => <field.TextField label="Last Name" />}
      </form.AppField>

      <form.AppField name="email">
        {(field) => <field.TextField label="Email" />}
      </form.AppField>

      <form.AppField name="image">
        {(field) => <field.TextField label="Image" />}
      </form.AppField>
    </form>
  )
}

export { AccountForm }
