'use client'

import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { capitalize } from 'lodash'
import { useMemo, type ComponentProps } from 'react'

import { DateField } from '~/components/form/date-field'
import { FileField } from '~/components/form/file-field'
import { SelectField } from '~/components/form/select-field'
import { TextField } from '~/components/form/text-field'
import { Button } from '~/components/ui/button'
import { api } from '~/rpc/client'
import { BankAccountTypeEnum, TransactionTypeEnum } from '~/server/db/enums'

const { fieldContext, formContext, useFieldContext } = createFormHookContexts()
const { useAppForm } = createFormHook({
  fieldComponents: {
    BankAccountField: (
      props: Omit<ComponentProps<typeof SelectField>, 'data' | 'field'>,
    ) => {
      const field = useFieldContext<string>()
      const bankAccounts = useQuery(
        api.bankAccounts.getAll.queryOptions({
          select: (data) =>
            data.map((acc) => ({ value: acc.id, label: acc.name })),
        }),
      )
      return (
        <SelectField {...props} data={bankAccounts.promise} field={field} />
      )
    },
    BankAccountTypeField: (
      props: Omit<ComponentProps<typeof SelectField>, 'data' | 'field'>,
    ) => {
      const data = useMemo(
        () =>
          BankAccountTypeEnum.enumValues.map((type) => ({
            value: type,
            label: capitalize(type),
          })),
        [],
      )
      const field = useFieldContext<string>()
      return <SelectField {...props} data={data} field={field} />
    },
    CategoryField: (
      props: Omit<ComponentProps<typeof SelectField>, 'data' | 'field'>,
    ) => {
      const field = useFieldContext<string>()
      const categories = useQuery(
        api.categories.getAll.queryOptions({
          input: {},
          select: (data) =>
            data.map((cat) => ({
              value: cat.id,
              label: cat.name,
              icon: cat.icon,
              children: cat.subcategories?.map((cat) => ({
                value: cat.id,
                label: cat.name,
                icon: cat.icon,
              })),
            })),
        }),
      )
      return <SelectField {...props} data={categories.promise} field={field} />
    },
    DateField: (props: Omit<ComponentProps<typeof DateField>, 'field'>) => {
      const field = useFieldContext<Date>()
      return <DateField {...props} field={field} />
    },
    FileField: (props: Omit<ComponentProps<typeof FileField>, 'field'>) => {
      const field = useFieldContext<File | undefined>()
      return <FileField {...props} field={field} />
    },
    SelectField: (props: Omit<ComponentProps<typeof SelectField>, 'field'>) => {
      const field = useFieldContext<string>()
      return <SelectField {...props} field={field} />
    },
    TextField: (props: Omit<ComponentProps<typeof TextField>, 'field'>) => {
      const field = useFieldContext<string>()
      return <TextField {...props} field={field} />
    },
    TransactionTypeField: (
      props: Omit<ComponentProps<typeof SelectField>, 'data' | 'field'>,
    ) => {
      const data = useMemo(
        () =>
          TransactionTypeEnum.enumValues.map((type) => ({
            value: type,
            label: type,
          })),
        [],
      )
      const field = useFieldContext<string>()
      return <SelectField {...props} data={data} field={field} />
    },
  },
  fieldContext,
  formComponents: {
    SubmitButton: (props: { disabled?: boolean; children: string }) => {
      return (
        <Button type="submit" className="w-full" disabled={props.disabled}>
          {props.children}
        </Button>
      )
    },
  },
  formContext,
})

export { useAppForm }
