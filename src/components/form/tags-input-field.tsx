import { useId, type ComponentProps, type ReactNode } from 'react'

import { Label } from '~/components/ui/label'
import { TagsInput } from '~/components/ui/tags-input'
import { cn } from '~/lib/utils'
import type { FieldApi } from './types'

interface TagsInputFieldProps
  extends Omit<
    ComponentProps<typeof TagsInput>,
    'id' | 'name' | 'value' | 'onBlur' | 'onValueChange'
  > {
  badge?: ReactNode
  field: FieldApi<string[] | null>
  label: string
}

function TagsInputField({
  badge,
  className,
  field,
  label,
  ...props
}: TagsInputFieldProps) {
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
      <TagsInput
        {...props}
        id={id}
        name={field.name}
        aria-invalid={hasError}
        aria-describedby={badge ? `badge-${id}` : undefined}
        className={hasError ? 'border-destructive' : ''}
        value={field.state.value ?? []}
        onBlur={() => field.handleBlur()}
        onValueChange={(value) => field.handleChange(value)}
      />
      <div className="text-sm whitespace-pre-wrap text-red-400">
        {field.state.meta.errors.map((e) => e.message).join('\n')}
      </div>
    </div>
  )
}

export { TagsInputField }
