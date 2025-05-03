import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { type ComponentProps } from 'react'

import { TextField } from '~/components/form/text-field'
import { Button } from '~/components/ui/button'

const { fieldContext, formContext, useFieldContext } = createFormHookContexts()
const { useAppForm: useAuthForm } = createFormHook({
  fieldComponents: {
    TextField: (props: Omit<ComponentProps<typeof TextField>, 'field'>) => {
      const field = useFieldContext<string>()
      return <TextField {...props} field={field} />
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
