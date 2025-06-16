'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, type ComponentProps } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { SkeletonWrapper } from '~/components/ui/skeleton-wrapper'
import { api } from '~/rpc/client'

interface BankAccountPickerProps
  extends Pick<
      ComponentProps<typeof Select>,
      'defaultValue' | 'disabled' | 'onValueChange'
    >,
    Pick<ComponentProps<typeof SelectValue>, 'placeholder'>,
    Pick<ComponentProps<typeof SelectTrigger>, 'aria-label'> {}

function BankAccountPicker({
  'aria-label': ariaLabel,
  defaultValue,
  disabled,
  onValueChange,
  placeholder,
}: BankAccountPickerProps) {
  const { data, isPending } = useQuery(
    api.bankAccounts.getAll.queryOptions({
      select: (data) =>
        data.map((acc) => ({
          value: acc.id,
          label: acc.name + ' - ' + acc.type,
        })),
    }),
  )
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')

  return (
    <SkeletonWrapper isLoading={isPending}>
      <Select
        value={internalValue}
        disabled={disabled}
        onValueChange={(value) => {
          setInternalValue(value)
          onValueChange?.(value)
        }}>
        <SelectTrigger aria-label={ariaLabel}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {data?.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SkeletonWrapper>
  )
}

export { BankAccountPicker }
