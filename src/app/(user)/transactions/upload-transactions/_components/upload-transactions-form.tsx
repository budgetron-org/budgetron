'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, type ComponentProps } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'

import { AccountPicker } from '~/components/account-picker'
import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { useParseOFXFile } from '~/features/transactions/hooks'
import { ParseOFXSchema } from '~/features/transactions/schema'
import type { TransactionWithRelations } from '~/features/transactions/types'
import { useHousehold } from '~/hooks/use-household'
import { cn } from '~/lib/utils'

type UploadTransactionsFormProps = {
  onSubmit?: (data: TransactionWithRelations[]) => void
  onCancel?: () => void
} & Omit<ComponentProps<'form'>, 'onSubmit'>

export function UploadTransactionsForm({
  className,
  onCancel,
  onSubmit,
  ...props
}: UploadTransactionsFormProps) {
  const form = useForm<z.infer<typeof ParseOFXSchema>>({
    resolver: zodResolver(ParseOFXSchema),
  })
  const { currentHouseholdId: householdId } = useHousehold()

  const { mutate, isPending } = useParseOFXFile({
    onSuccess: onSubmit,
  })

  const onFormSubmit = useCallback<
    SubmitHandler<z.infer<typeof ParseOFXSchema>>
  >(
    async ({ bankAccountId, file }) =>
      mutate({ bankAccountId, file, householdId }),
    [householdId, mutate],
  )

  return (
    <Form {...form}>
      <form
        className={cn('grid grid-cols-1 gap-4 md:grid-cols-2', className)}
        onSubmit={form.handleSubmit(onFormSubmit)}
        {...props}>
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".ofx,.qfx"
                  {...field}
                  value={undefined}
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bankAccountId"
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

        <div className="flex items-center justify-end gap-2 md:col-span-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>

          <Button disabled={isPending}>Load Transactions</Button>
        </div>
      </form>
    </Form>
  )
}
