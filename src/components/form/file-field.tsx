import { useId, type ComponentProps } from 'react'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'
import type { FieldApi } from './types'

interface FileFieldProps {
  accept?: ComponentProps<typeof Input>['accept']
  className?: string
  field: FieldApi<File | undefined>
  label: string
  placeholder?: ComponentProps<typeof Input>['placeholder']
}

function FileField({ accept, className, field, label }: FileFieldProps) {
  const id = useId()
  const hasError = field.state.meta.errors.length > 0
  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        accept={accept}
        name={field.name}
        type="file"
        aria-invalid={hasError}
        className={hasError ? 'border-destructive' : ''}
        value={undefined}
        onBlur={() => field.handleBlur()}
        onChange={(event) => field.handleChange(event.target.files?.[0])}
      />
      <div className="text-sm whitespace-pre-wrap text-red-400">
        {field.state.meta.errors.map((e) => e.message).join('\n')}
      </div>
    </div>
  )
}

export { FileField }
