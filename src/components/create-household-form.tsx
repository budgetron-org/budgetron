'use client'

import { LoaderCircleIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import type { useForm } from 'react-hook-form'
import z from 'zod'

import { IconPicker } from '@/components/icon-picker'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CURRENCIES } from '@/data/currencies'
import { cn } from '@/lib/utils'
import type { CreateHouseholdSchema } from '@/schemas/household'

type FormSchema = z.infer<typeof CreateHouseholdSchema>

type CreateHouseholdFormProps = Omit<ComponentProps<'form'>, 'onSubmit'> & {
  form: ReturnType<typeof useForm<FormSchema>>
  isSubmissionDisabled?: boolean
  onSubmit: (values: FormSchema) => void
  onCancel?: () => void
  submitButtonLabel?: string
  cancelButtonLabel?: string
  hasCustomFooterButtons?: boolean
}

export function CreateHouseholdForm({
  className,
  form,
  isSubmissionDisabled,
  onCancel,
  onSubmit,
  cancelButtonLabel = 'Cancel',
  submitButtonLabel = 'Submit',
  hasCustomFooterButtons,
  ...props
}: CreateHouseholdFormProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-4', className)}
        {...props}>
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <IconPicker {...field} defaultValue={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your household name" {...field} />
              </FormControl>
              <FormDescription>
                This is your household display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <FormControl>
                <Combobox
                  {...field}
                  data={CURRENCIES.map((i) => ({
                    value: i.code,
                    label: `${i.name} (${i.symbol})`,
                  }))}
                  placeholder="Select a currency"
                />
              </FormControl>
              <FormDescription>
                This will be the currency for this household.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {!hasCustomFooterButtons && (
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              {cancelButtonLabel}
            </Button>

            <Button type="submit" disabled={isSubmissionDisabled}>
              {isSubmissionDisabled ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                submitButtonLabel
              )}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
