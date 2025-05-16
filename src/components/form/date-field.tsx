import { useId, type ComponentProps } from 'react'

import { DatePicker } from '~/components/ui/date-picker'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'
import type { FieldApi } from './types'

interface DateFieldProps {
  className?: string
  field: FieldApi<Date>
  label: string
  placeholder?: ComponentProps<typeof DatePicker>['placeholder']
}

function DateField({ className, field, label }: DateFieldProps) {
  const id = useId()
  const hasError = field.state.meta.errors.length > 0
  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <DatePicker
        id={id}
        aria-invalid={hasError}
        className={hasError ? 'border-destructive' : ''}
        value={field.state.value}
        onBlur={() => field.handleBlur()}
        onChange={(value) => field.handleChange(value)}
      />
      <div className="text-sm whitespace-pre-wrap text-red-400">
        {field.state.meta.errors.map((e) => e.message).join('\n')}
      </div>
    </div>
  )
}

export { DateField }
