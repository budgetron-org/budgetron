import { useQuery } from '@tanstack/react-query'
import { useMemo, useState, type ComponentProps } from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { SkeletonWrapper } from '~/components/ui/skeleton-wrapper'
import { api } from '~/rpc/client'
import type { TransactionType } from '~/server/db/enums'

type Data = {
  value: string
  label: string
  icon?: string
  children?: Omit<Data, 'children'>[]
}

function findLabel<V extends string, D extends Data>(
  data: Readonly<D[]> | undefined,
  value: V | undefined,
) {
  if (!data || !value) return undefined
  const parent = data.find(
    (item) =>
      item.value === value ||
      item.children?.some((child) => child.value === value),
  )
  const item = parent?.children?.find((child) => child.value === value)

  // If there is no parent, there will be no item as well. This means we are
  // in an INVALID state. Return the INVALID state.
  if (!parent) return 'NO_NAME_ERROR'

  // If the parent's value is the value or there is no item, then return the parents label
  if (parent.value === value || !item) return parent.label

  // If the parent's value is not the value, then return the parent's label and the item's label
  return `${parent.label} - ${item.label}`
}

interface CategoryPickerProps
  extends Pick<ComponentProps<typeof Select>, 'defaultValue' | 'onValueChange'>,
    Pick<ComponentProps<typeof SelectValue>, 'placeholder'>,
    Pick<ComponentProps<typeof SelectTrigger>, 'aria-label'> {
  type?: TransactionType | 'ALL'
}

function CategoryPicker({
  'aria-label': ariaLabel,
  defaultValue,
  onValueChange,
  placeholder,
  type = 'ALL',
}: CategoryPickerProps) {
  const { data, isPending } = useQuery(
    api.categories.getAll.queryOptions({
      input: { type: type !== 'ALL' ? type : undefined },
      select: (data) =>
        data.map((cat) => ({
          value: cat.id,
          label: cat.name,
          icon: cat.icon,
          children: cat.subcategories?.map((cat) => ({
            value: cat.id,
            label: cat.name,
            icon: cat.icon,
          })),
        })),
    }),
  )
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const displayValue = useMemo(
    () => findLabel(data, internalValue),
    [data, internalValue],
  )

  return (
    <SkeletonWrapper isLoading={isPending}>
      <Select
        value={internalValue}
        onValueChange={(value) => {
          setInternalValue(value)
          onValueChange?.(value)
        }}>
        <SelectTrigger aria-label={ariaLabel}>
          <SelectValue placeholder={placeholder}>
            {displayValue && <span>{displayValue}</span>}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {data?.map((item) =>
            Array.isArray(item.children) ? (
              <SelectGroup key={item.value}>
                <SelectLabel>{item.label}</SelectLabel>
                {item.children.map((subitem) => (
                  <SelectItem key={subitem.value} value={subitem.value}>
                    {subitem.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ) : (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>
    </SkeletonWrapper>
  )
}

export { CategoryPicker }
