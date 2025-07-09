'use client'

import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { capitalize } from 'lodash'
import { useMemo, type ComponentProps } from 'react'

import { CheckboxField } from '~/components/form/checkbox-field'
import { DateField } from '~/components/form/date-field'
import { FileField } from '~/components/form/file-field'
import { SelectField } from '~/components/form/select-field'
import { TagsInputField } from '~/components/form/tags-input-field'
import { TextField } from '~/components/form/text-field'
import { TextareaField } from '~/components/form/textarea-field'
import { ProgressButton } from '~/components/ui/progress-button'
import { CURRENCIES, type CurrencyCode } from '~/data/currencies'
import { cn, getCurrencyMeta } from '~/lib/utils'
import { api } from '~/rpc/client'
import { BankAccountTypeEnum, TransactionTypeEnum } from '~/server/db/schema'

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()
const { useAppForm } = createFormHook({
  fieldComponents: {
    BankAccountField: (
      props: Omit<ComponentProps<typeof SelectField>, 'options' | 'field'>,
    ) => {
      const field = useFieldContext<string | undefined>()
      const { data, isPending } = useQuery(
        api.bankAccounts.getAll.queryOptions({
          select: (data) =>
            data.map((acc) => ({
              value: acc.id,
              label: `${acc.name} (${getCurrencyMeta(acc.currency).symbol})`,
            })),
        }),
      )
      return (
        <SelectField
          {...props}
          options={data ?? []}
          isLoading={isPending}
          field={field}
        />
      )
    },
    BankAccountTypeField: (
      props: Omit<ComponentProps<typeof SelectField>, 'options' | 'field'>,
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
      return <SelectField {...props} options={data} field={field} />
    },
    CategoryField: (
      props: Omit<ComponentProps<typeof SelectField>, 'options' | 'field'> & {
        type?: (typeof TransactionTypeEnum.enumValues)[number]
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
          options={filteredData}
          isLoading={isPending}
          field={field}
        />
      )
    },
    CheckboxField: (
      props: Omit<ComponentProps<typeof CheckboxField>, 'field'>,
    ) => {
      const field = useFieldContext<boolean>()
      return <CheckboxField {...props} field={field} />
    },
    CurrencyField: (
      props: Omit<ComponentProps<typeof SelectField>, 'options' | 'field'>,
    ) => {
      const field = useFieldContext<CurrencyCode | undefined>()
      const data = useMemo(
        () =>
          CURRENCIES.map((c) => ({
            value: c.code,
            label: `${c.code} - ${c.name} (${c.symbol})`,
          })),
        [],
      )
      return <SelectField {...props} options={data} field={field} />
    },
    DateField: (props: Omit<ComponentProps<typeof DateField>, 'field'>) => {
      const field = useFieldContext<Date>()
      return <DateField {...props} field={field} />
    },
    FileField: (props: Omit<ComponentProps<typeof FileField>, 'field'>) => {
      const field = useFieldContext<File[] | undefined>()
      return <FileField {...props} field={field} />
    },
    SelectField: (props: Omit<ComponentProps<typeof SelectField>, 'field'>) => {
      const field = useFieldContext<string | undefined>()
      return <SelectField {...props} field={field} />
    },
    TagsInputField: (
      props: Omit<ComponentProps<typeof TagsInputField>, 'field'>,
    ) => {
      const field = useFieldContext<string[] | null>()
      return <TagsInputField {...props} field={field} />
    },
    TextField: (props: Omit<ComponentProps<typeof TextField>, 'field'>) => {
      const field = useFieldContext<string>()
      return <TextField {...props} field={field} />
    },
    TextareaField: (
      props: Omit<ComponentProps<typeof TextareaField>, 'field'>,
    ) => {
      const field = useFieldContext<string>()
      return <TextareaField {...props} field={field} />
    },
    TransactionTypeField: (
      props: Omit<ComponentProps<typeof SelectField>, 'options' | 'field'>,
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
      return <SelectField {...props} options={data} field={field} />
    },
  },
  fieldContext,
  formComponents: {
    SubmitButton: ({
      className,
      submitOnClick,
      onClick,
      ...props
    }: Omit<ComponentProps<typeof ProgressButton>, 'type'> & {
      submitOnClick?: boolean
    }) => {
      const form = useFormContext()
      return (
        <form.Subscribe
          selector={(formState) => [formState.canSubmit, formState.isDirty]}>
          {([canSubmit, isDirty]) => (
            <ProgressButton
              type="submit"
              className={cn('w-full', className)}
              disabled={!canSubmit || !isDirty}
              onClick={(event) => {
                if (submitOnClick) {
                  form.handleSubmit()
                }
                onClick?.(event)
              }}
              {...props}>
              {props.children}
            </ProgressButton>
          )}
        </form.Subscribe>
      )
    },
  },
  formContext,
})

export { useAppForm }
