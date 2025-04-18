'use client'

import { useQuery } from '@tanstack/react-query'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useCallback, type ComponentPropsWithoutRef } from 'react'

import type { GetCategoriesResponse } from '~/app/api/categories/route'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { safeParseLucideIcon } from '~/lib/utils'

type CategoryItem = GetCategoriesResponse[number]

type SelectProps = Omit<ComponentPropsWithoutRef<typeof Select>, 'value'>
type CategoryPickerProps = SelectProps & {
  className?: string
  placeholder?: string
  value?: string | null
  onChange?: (value?: string, item?: CategoryItem) => void
}

export function CategoryPicker({
  className,
  disabled,
  placeholder = 'Select a category',
  value,
  onChange,
  ...props
}: CategoryPickerProps) {
  const { data, status } = useQuery<GetCategoriesResponse>({
    queryKey: ['categories'],
    queryFn: ({ signal }) =>
      fetch('/api/categories', { signal }).then((res) => res.json()),
  })

  const onValueChange = useCallback(
    (categoryId: string) => {
      const categoryItem = data?.find((i) => i.id === categoryId)
      onChange?.(categoryId, categoryItem)
    },
    [data, onChange],
  )

  return (
    <Select
      onValueChange={onValueChange}
      value={value ?? undefined}
      disabled={status !== 'success' || disabled}
      {...props}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {status === 'success' &&
          data.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <DynamicIcon name={safeParseLucideIcon(category.icon)} />
              {category.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}
