'use client'

import { Suspense, use, useId, useMemo, type ComponentProps } from 'react'

import { Button } from '~/components/ui/button'
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

type Option<V> = {
  value: V
  label: string
  icon?: string
  children?: Option<V>[]
}

function isHierarchicalData<D extends Option<unknown>>(options: Readonly<D[]>) {
  return options.some((i) => i.children != null)
}

function findLabel<V extends string, D extends Option<unknown>>(
  options: Readonly<D[]>,
  value: V,
  fallback = 'NO_NAME_ERROR',
) {
  const parent = options.find(
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
  disabled?: boolean
  options: Readonly<D[]> | Promise<Readonly<D[]>>
  field: FieldApi<V | undefined>
  id?: ComponentProps<typeof SelectTrigger>['id']
  isClearable?: boolean
  placeholder?: ComponentProps<typeof SelectValue>['placeholder']
}

function SelectImpl<V extends string, D extends Option<V>>({
  disabled,
  options: optionsMayBePromise,
  field,
  id,
  isClearable,
  placeholder,
}: SelectImplProps<V, D>) {
  const options =
    optionsMayBePromise instanceof Promise
      ? use(optionsMayBePromise)
      : optionsMayBePromise
  const hasError = field.state.meta.errors.length > 0
  const hasGroups = useMemo(() => isHierarchicalData(options), [options])
  const displayValue = useMemo(() => {
    if (!hasGroups || !field.state.value) return undefined
    return findLabel(options, field.state.value)
  }, [options, field.state.value, hasGroups])

  return (
    <Select
      // Workaround for https://github.com/radix-ui/primitives/issues/3135
      key={field.state.value ? 'state-value' : 'state-initial'}
      disabled={disabled}
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
        {isClearable && field.state.value && (
          <Button
            variant="ghost"
            className="text-muted-foreground w-full cursor-default justify-start px-2"
            size="sm"
            onClick={() => field.setValue(null as unknown as V)}>
            {placeholder ?? 'Clear selection'}
          </Button>
        )}
        {options.map((item) =>
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

interface SelectFieldProps<V extends string, D extends Option<V>>
  extends Pick<
    ComponentProps<typeof SelectImpl<V, D>>,
    'disabled' | 'options' | 'field' | 'placeholder' | 'isClearable'
  > {
  className?: string
  // TODO: React.use and Suspense is not working with useQuery.promise
  // So use isLoading for now.
  isLoading?: boolean
  label: string
}

function SelectField<V extends string, D extends Option<V>>({
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
