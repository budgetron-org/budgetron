'use client'

import { Suspense, use, useId, useMemo, type ComponentProps } from 'react'

import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import { SkeletonWrapper } from '~/components/ui/skeleton-wrapper'
import { cn } from '~/lib/utils'
import type { FieldApi } from './types'

type Data<V> = { value: V; label: string; icon?: string; children?: Data<V>[] }

function isHierarchicalData<D extends Data<unknown>>(data: Readonly<D[]>) {
  return data.some((i) => i.children != null)
}

function findLabel<V extends string, D extends Data<unknown>>(
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
    return fallback
  }
  if (parent.value === value || parent.children == null) return parent.label

  return `${parent.label} - ${parent.children.find((child) => child.value === value)?.label ?? fallback}`
}

interface SelectImplProps<V extends string, D> {
  data: Readonly<D[]> | Promise<Readonly<D[]>>
  field: FieldApi<V | undefined>
  id?: ComponentProps<typeof SelectTrigger>['id']
  placeholder?: ComponentProps<typeof SelectValue>['placeholder']
}

function SelectImpl<V extends string, D extends Data<V>>({
  data: dataMayBePromise,
  field,
  id,
  placeholder,
}: SelectImplProps<V, D>) {
  const data =
    dataMayBePromise instanceof Promise
      ? use(dataMayBePromise)
      : dataMayBePromise
  const hasError = field.state.meta.errors.length > 0
  const hasGroups = useMemo(() => isHierarchicalData(data), [data])
  const displayValue = useMemo(() => {
    if (!hasGroups || !field.state.value) return undefined
    return findLabel(data, field.state.value)
  }, [data, field.state.value, hasGroups])

  return (
    <Select
      value={field.state.value ?? ''} // value can be `null`, fix later in Types
      onValueChange={(value) => field.handleChange(value as V)}>
      <SelectTrigger
        id={id}
        name={field.name}
        aria-invalid={hasError}
        className={cn(hasError && 'border-destructive')}
        onBlur={() => field.handleBlur()}>
        <SelectValue placeholder={placeholder}>{displayValue}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {data.map((item) =>
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
  )
}

interface SelectFieldProps<V extends string, D extends Data<V>>
  extends Pick<
    ComponentProps<typeof SelectImpl<V, D>>,
    'data' | 'field' | 'placeholder'
  > {
  className?: string
  // TODO: React.use and Suspense is not working with useQuery.promise
  // So use isLoading for now.
  isLoading?: boolean
  label: string
}

function SelectField<V extends string, D extends Data<V>>({
  className,
  field,
  isLoading,
  label,
  ...props
}: SelectFieldProps<V, D>) {
  const id = useId()
  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <SkeletonWrapper isLoading={isLoading}>
          <SelectImpl {...props} field={field} id={id} />
        </SkeletonWrapper>
      </Suspense>
      <div className="text-sm whitespace-pre-wrap text-red-400">
        {field.state.meta.errors.map((e) => e.message).join('\n')}
      </div>
    </div>
  )
}

export { SelectField }
