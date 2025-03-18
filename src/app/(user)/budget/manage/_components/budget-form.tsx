'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

import { updateBudget } from '@/actions/budget'
import type { GetBudgetResponse } from '@/app/api/budgets/route'
import { SkeletonWrapper } from '@/components/skeleton-wrapper'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { safeParseLucideIcon } from '@/lib/utils'
import { BudgetFormSchema } from '@/schemas/budget'
import { LoaderCircleIcon } from 'lucide-react'

const BUDGET_MUTATION_TOAST_ID = 'saving-budget'

export function BudgetForm() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isFetching } = useQuery<GetBudgetResponse>({
    queryKey: ['budgets'],
    queryFn: ({ signal }) =>
      fetch('/api/budgets', { signal }).then((res) => res.json()),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: updateBudget,
    onMutate() {
      toast.loading('Saving new budget', { id: BUDGET_MUTATION_TOAST_ID })
    },
    onError(error) {
      toast.error(String(error), { id: BUDGET_MUTATION_TOAST_ID })
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['budgets'] })
      toast.success('Budget updated', { id: BUDGET_MUTATION_TOAST_ID })
      router.push('/budget')
    },
  })

  const form = useForm<z.infer<typeof BudgetFormSchema>>({
    resolver: zodResolver(BudgetFormSchema),
    reValidateMode: 'onBlur',
    values: data?.reduce(
      (acc, row) => {
        acc[row.categoryId] = row.budgetAmount ?? ''
        return acc
      },
      {} as Record<string, string>,
    ),
  })

  const onSubmit = useCallback<SubmitHandler<z.infer<typeof BudgetFormSchema>>>(
    (form) => {
      mutate(
        Object.entries(form).map(([categoryId, amount]) => ({
          categoryId,
          amount,
        })),
      )
    },
    [mutate],
  )

  return (
    <SkeletonWrapper isLoading={isFetching}>
      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data?.map(({ categoryIcon, categoryId, categoryName }) => (
              <FormField
                key={categoryId}
                control={form.control}
                name={categoryId}
                defaultValue=""
                render={({ field }) => (
                  <FormItem className="grid-cols-2 items-center">
                    <FormLabel className="flex items-center gap-2">
                      <DynamicIcon name={safeParseLucideIcon(categoryIcon)} />
                      {categoryName}
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm font-semibold">
                        USD
                      </span>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            ))}
          </div>

          <div className="flex w-full flex-col items-center gap-4 md:flex-row md:justify-end">
            <Button
              className="w-full md:w-auto"
              type="reset"
              variant="outline"
              disabled={isPending}>
              Cancel
            </Button>
            <Button
              className="w-full md:w-auto"
              disabled={isPending || !form.formState.isDirty}>
              {isPending ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </SkeletonWrapper>
  )
}
