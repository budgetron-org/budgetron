import { useId, type ComponentProps } from 'react'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'
import type { FieldApi } from './types'

interface FileFieldProps extends Omit<ComponentProps<typeof Input>, 'type'> {
  field: FieldApi<File[] | undefined>
  label: string
}

function FileField({ className, field, label, ...props }: FileFieldProps) {
  const id = useId()
  const hasError = field.state.meta.errors.length > 0
  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={field.name}
        type="file"
        aria-invalid={hasError}
        className={hasError ? 'border-destructive' : ''}
        value={undefined}
        onBlur={() => field.handleBlur()}
        onChange={(event) =>
          field.handleChange(
            event.target.files ? Array.from(event.target.files) : undefined,
          )
        }
        {...props}
      />
      <div className="text-sm whitespace-pre-wrap text-red-400">
        {field.state.meta.errors.map((e) => e.message).join('\n')}
      </div>
    </div>
  )
}

export { FileField }
