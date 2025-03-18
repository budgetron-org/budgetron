'use client'

import { useQuery } from '@tanstack/react-query'
import { type ComponentPropsWithoutRef } from 'react'

import type { GetAccountsResponse } from '@/app/api/accounts/route'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type SelectProps = Omit<ComponentPropsWithoutRef<typeof Select>, 'value'>
type AccountPickerProps = SelectProps & {
  className?: string
  placeholder?: string
  value?: string | null
  onChange?: (value?: string) => void
}

export function AccountPicker({
  className,
  disabled,
  placeholder = 'Select an account',
  value,
  onChange,
  ...props
}: AccountPickerProps) {
  const { data, status } = useQuery<GetAccountsResponse>({
    queryKey: ['accounts'],
    queryFn: ({ signal }) =>
      fetch('/api/accounts', { signal }).then((res) => res.json()),
  })

  return (
    <Select
      onValueChange={onChange}
      value={value ?? undefined}
      disabled={status !== 'success' || disabled}
      {...props}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {status === 'success' &&
          data.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}
