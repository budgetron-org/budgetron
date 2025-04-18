import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { useId, type ComponentProps } from 'react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

const { fieldContext, formContext, useFieldContext } = createFormHookContexts()
const { useAppForm: useAuthForm } = createFormHook({
  fieldComponents: {
    TextField: (props: {
      label: string
      type?: ComponentProps<'input'>['type']
    }) => {
      const field = useFieldContext<string>()
      const id = useId()
      const hasError = field.state.meta.errors.length > 0
      return (
        <div className="grid gap-2">
          <Label htmlFor={id}>{props.label}</Label>
          <Input
            id={id}
            name={field.name}
            type={props.type}
            aria-invalid={hasError}
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
    },
  },
  formComponents: {
    SubmitButton: (props: { disabled?: boolean; children: string }) => {
      return (
        <Button type="submit" className="w-full" disabled={props.disabled}>
          {props.children}
        </Button>
      )
    },
  },
  fieldContext,
  formContext,
})

export { useAuthForm }
