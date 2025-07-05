import { useId, type ComponentProps, type ReactNode } from 'react'

import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { cn } from '~/lib/utils'
import type { FieldApi } from './types'

interface TextareaFieldProps
  extends Omit<
    ComponentProps<typeof Textarea>,
    'id' | 'name' | 'value' | 'onBlur' | 'onChange'
  > {
  badge?: ReactNode
  field: FieldApi<string>
  label: string
}

function TextareaField({
  badge,
  className,
  field,
  label,
  ...props
}: TextareaFieldProps) {
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
      <Textarea
        {...props}
        id={id}
        name={field.name}
        aria-invalid={hasError}
        aria-describedby={badge ? `badge-${id}` : undefined}
        className={hasError ? 'border-destructive' : ''}
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

export { TextareaField }
