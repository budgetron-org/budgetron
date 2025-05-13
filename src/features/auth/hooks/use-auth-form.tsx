import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { type ComponentProps } from 'react'

import { TextField } from '~/components/form/text-field'
import { ProgressButton } from '~/components/ui/progress-button'
import { cn } from '~/lib/utils'

const { fieldContext, formContext, useFieldContext } = createFormHookContexts()
const { useAppForm: useAuthForm } = createFormHook({
  fieldComponents: {
    TextField: (props: Omit<ComponentProps<typeof TextField>, 'field'>) => {
      const field = useFieldContext<string>()
      return <TextField {...props} field={field} />
    },
  },
  formComponents: {
    SubmitButton: ({
      className,
      ...props
    }: Omit<ComponentProps<typeof ProgressButton>, 'type'>) => {
      return (
        <ProgressButton
          type="submit"
          className={cn('w-full', className)}
          {...props}>
          {props.children}
        </ProgressButton>
      )
    },
  },
  fieldContext,
  formContext,
})

export { useAuthForm }
