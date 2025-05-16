import { useQuery } from '@tanstack/react-query'
import { useMemo, type ComponentProps } from 'react'

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

function isHierarchicalData<D extends Data>(data: Readonly<D[]>) {
  return data.some((i) => i.children != null)
}

function findLabel<V extends string, D extends Data>(
  data: Readonly<D[]>,
  value: V,
  fallback = 'NO_NAME_ERROR',
) {
  const parent = data.find(
    (item) =>
      item.value === value ||
      item.children?.some((child) => child.value === value),
  )
  if (!parent) {
    debugger
    return fallback
  }
  if (parent.value === value || parent.children == null) return parent.label

  return `${parent.label} - ${parent.children.find((child) => child.value === value)?.label ?? fallback}`
}

interface CategoryPickerProps
  extends Pick<
      ComponentProps<typeof Select>,
      'value' | 'defaultValue' | 'onValueChange'
    >,
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
  value,
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
  const hasGroups = useMemo(() => data && isHierarchicalData(data), [data])
  const displayValue = useMemo(() => {
    if (!hasGroups || !value || !data) return undefined
    return findLabel(data, value)
  }, [data, hasGroups, value])

  return (
    <SkeletonWrapper isLoading={isPending}>
      <Select
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange}>
        <SelectTrigger aria-label={ariaLabel}>
          <SelectValue placeholder={placeholder}>{displayValue}</SelectValue>
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
