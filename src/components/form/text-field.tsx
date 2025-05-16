import { useId, type ComponentProps, type ReactNode } from 'react'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'
import type { FieldApi } from './types'

interface TextFieldProps {
  badge?: ReactNode
  className?: string
  disabled?: boolean
  field: FieldApi<string>
  label: string
  placeholder?: ComponentProps<typeof Input>['placeholder']
  type?: ComponentProps<'input'>['type']
}

function TextField({
  badge,
  className,
  disabled,
  field,
  label,
  placeholder,
  type,
}: TextFieldProps) {
  const id = useId()
  const hasError = field.state.meta.errors.length > 0
  return (
    <div className={cn('grid gap-2', className)}>
      {badge ? (
        <div className="flex items-center gap-2">
          <Label htmlFor={id}>{label}</Label>
          <div className="contents" id={`badge-${id}`}>
            {badge}
          </div>
        </div>
      ) : (
        <Label htmlFor={id}>{label}</Label>
      )}
      <Input
        id={id}
        name={field.name}
        type={type}
        aria-invalid={hasError}
        aria-describedby={badge ? `badge-${id}` : undefined}
        className={hasError ? 'border-destructive' : ''}
        disabled={disabled}
        placeholder={placeholder}
        value={field.state.value}
        onBlur={() => field.handleBlur()}
        onChange={(event) => field.handleChange(event.target.value)}
      />
      <div className="text-sm whitespace-pre-wrap text-red-400">
        {field.state.meta.errors.map((e) => e.message).join('\n')}
      </div>
    </div>
  )
}

export { TextField }
