'use client'

import { type ComponentPropsWithoutRef } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

type SelectProps = Omit<ComponentPropsWithoutRef<typeof Select>, 'value'>
type TransactionTypePickerProps = SelectProps & {
  className?: string
  placeholder?: string
  value?: string | null
  onChange?: (value?: string) => void
}

export function TransactionTypePicker({
  className,
  disabled,
  placeholder,
  value,
  onChange,
  ...props
}: TransactionTypePickerProps) {
  return (
    <Select
      onValueChange={onChange}
      value={value ?? undefined}
      disabled={disabled}
      {...props}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="expense">Expense</SelectItem>
        <SelectItem value="income">Income</SelectItem>
      </SelectContent>
    </Select>
  )
}
