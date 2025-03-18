'use client'

import { type ComponentProps } from 'react'
import { type SubmitHandler, type UseFormReturn } from 'react-hook-form'
import type { z } from 'zod'

import { AccountPicker } from '@/components/account-picker'
import { CategoryPicker } from '@/components/category-picker'
import { TransactionTypePicker } from '@/components/type-picker'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { CreateTransactionSchemaWithoutUser } from '@/schemas/transaction'

type CreateEditTransactionFormFields = z.infer<
  typeof CreateTransactionSchemaWithoutUser
>

type CreateEditTransactionFormProps = {
  form: UseFormReturn<CreateEditTransactionFormFields>
  onSubmit: SubmitHandler<CreateEditTransactionFormFields>
} & Omit<ComponentProps<'form'>, 'onSubmit'>

export function CreateEditTransactionForm({
  className,
  form,
  onSubmit,
  ...props
}: CreateEditTransactionFormProps) {
  return (
    <Form {...form}>
      <form
        {...props}
        className={cn('grid grid-cols-1 gap-4 md:grid-cols-2', className)}
        onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <TransactionTypePicker {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <CategoryPicker {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <AccountPicker {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
