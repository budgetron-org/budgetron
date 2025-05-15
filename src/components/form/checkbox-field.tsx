import { useId } from 'react'

import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'
import type { FieldApi } from './types'

type CheckboxFieldProps = {
  className?: string
  field: FieldApi<boolean>
  label: string
}

function CheckboxField({ className, field, label }: CheckboxFieldProps) {
  const id = useId()
  const hasError = field.state.meta.errors.length > 0
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Checkbox
        id={id}
        aria-invalid={hasError}
        className={hasError ? 'border-destructive' : ''}
        checked={field.state.value}
        onBlur={() => field.handleBlur()}
        onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
      />
      <Label htmlFor={id}>{label}</Label>
      <div className="text-sm whitespace-pre-wrap text-red-400">
        {field.state.meta.errors.map((e) => e.message).join('\n')}
      </div>
    </div>
  )
}

export { CheckboxField }
