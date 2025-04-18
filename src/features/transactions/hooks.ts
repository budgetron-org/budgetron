import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  createMultipleTransactions,
  createTransaction,
  parseOFXFile,
} from './actions'
import type { AwaitedReturnType, Success } from '~/types/generic'

type Callbacks<T> = {
  onSuccess?: (data: T) => void
}

export function useCreateTransaction({
  onSuccess,
}: Callbacks<Success<AwaitedReturnType<typeof createTransaction>>['data']>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTransaction,
    onMutate() {
      toast.loading('Creating transaction...', {
        id: 'create-transaction',
      })
    },
    async onSuccess(result) {
      if (result.success) {
        toast.success('New transaction created!', {
          id: 'create-transaction',
        })
        await queryClient.invalidateQueries({ queryKey: ['transactions'] })
        onSuccess?.(result.data)
        return
      }
      toast.error(`Error: ${result.message}`, { id: 'create-transaction' })
    },
    onError() {
      toast.error(
        'Something went wrong when creating the transaction. Please try again.',
        { id: 'create-transaction' },
      )
    },
  })
}

export function useCreateMultipleTransactions({
  onSuccess,
}: Callbacks<
  Success<AwaitedReturnType<typeof createMultipleTransactions>>['data']
>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createMultipleTransactions,
    onMutate() {
      toast.loading('Creating transactions...', {
        id: 'create-transaction',
      })
    },
    async onSuccess(result) {
      if (result.success) {
        toast.success('Transactions created!', {
          id: 'create-transaction',
        })
        await queryClient.invalidateQueries({ queryKey: ['transactions'] })
        onSuccess?.(result.data)
        return
      }
      toast.error(`Error: ${result.message}`, { id: 'create-transaction' })
    },
    onError() {
      toast.error(
        'Something went wrong when creating the transactions. Please try again.',
        { id: 'create-transaction' },
      )
    },
  })
}

export function useParseOFXFile({
  onSuccess,
}: Callbacks<Success<AwaitedReturnType<typeof parseOFXFile>>['data']>) {
  return useMutation({
    mutationFn: parseOFXFile,
    onMutate() {
      toast.loading('Parsing the transactions', { id: 'parse-transactions' })
    },
    onSuccess(result) {
      if (result.success) {
        toast.success('Parsed the transactions', { id: 'parse-transactions' })
        onSuccess?.(result.data)
        return
      }
      toast.error(`Error: ${result.message}`, { id: 'parse-transaction' })
    },
    onError(error) {
      toast.error('Error parsing the file', {
        id: 'parse-transactions',
        description: String(error),
      })
    },
  })
}
