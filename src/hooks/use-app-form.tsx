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
import {
  BankAccountTypeEnum,
  TransactionTypeEnum,
  type TransactionType,
} from '~/server/db/enums'

const { fieldContext, formContext, useFieldContext } = createFormHookContexts()
const { useAppForm } = createFormHook({
  fieldComponents: {
    BankAccountField: (
      props: Omit<ComponentProps<typeof SelectField>, 'data' | 'field'>,
    ) => {
      const field = useFieldContext<string | undefined>()
      const { data, isPending } = useQuery(
        api.bankAccounts.getAll.queryOptions({
          select: (data) =>
            data.map((acc) => ({
              value: acc.id,
              label: acc.name + ' - ' + acc.type,
            })),
        }),
      )
      return (
        <SelectField
          {...props}
          data={data ?? []}
          isLoading={isPending}
          field={field}
        />
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
      const field = useFieldContext<string | undefined>()
      return <SelectField {...props} data={data} field={field} />
    },
    CategoryField: (
      props: Omit<ComponentProps<typeof SelectField>, 'data' | 'field'> & {
        type?: TransactionType
      },
    ) => {
      const field = useFieldContext<string | undefined>()
      const { data, isPending } = useQuery(
        api.categories.getAll.queryOptions({
          input: {},
          select: (data) =>
            data.map((cat) => ({
              value: cat.id,
              label: cat.name,
              icon: cat.icon,
              type: cat.type,
              children: cat.subcategories?.map((cat) => ({
                value: cat.id,
                label: cat.name,
                icon: cat.icon,
              })),
            })),
        }),
      )
      const filteredData = useMemo(() => {
        if (!data) return []
        if (!props.type) return data
        return data.filter((i) => i.type === props.type)
      }, [data, props.type])
      return (
        <SelectField
          {...props}
          data={filteredData}
          isLoading={isPending}
          field={field}
        />
      )
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
      const field = useFieldContext<string | undefined>()
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
      const field = useFieldContext<string | undefined>()
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
