'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { createMultipleTransactions } from '@/actions/transaction'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import type { TransactionRecord } from '@/schemas/transaction'
import { TransactionsTable } from '../../_components/transactions-table'
import { useTransactionsTable } from '../../_hooks/use-transactions-table'

type UploadTransactionsTableProps = {
  defaultData: TransactionRecord[]
  onCancel?: () => void
}
export function UploadTransactionsTable({
  defaultData,
  onCancel,
}: UploadTransactionsTableProps) {
  const [data, setData] = useState(defaultData)
  const { table } = useTransactionsTable({
    data,
    getRowId: ({ externalId }, index) => externalId ?? `row-${index}`,
    meta: {
      editable: {
        category: true,
        description: true,
      },
      updateCellData(rowIndex, columnId, value) {
        setData((prev) =>
          prev.map((row, index) => {
            if (index === rowIndex) return { ...row, [columnId]: value }
            return row
          }),
        )
      },
    },
  })

  const queryClient = useQueryClient()
  const router = useRouter()

  const toastId = 'upload-transactions'
  const { mutate, isPending } = useMutation({
    mutationFn: createMultipleTransactions,
    onMutate() {
      toast.loading('Uploading transactions', {
        id: toastId,
        description: undefined,
      })
    },
    onError(error) {
      toast.error('Failed to upload transactions', {
        id: toastId,
        description: String(error),
      })
    },
    async onSuccess() {
      toast.success('Uploaded transactions successfully', {
        id: toastId,
        description: undefined,
      })
      await queryClient.invalidateQueries({ queryKey: ['transactions'] })
      router.push('/transactions')
    },
  })

  const onDeleteTransactions = useCallback(() => {
    const rowsToDelete = table
      .getPaginationRowModel()
      .rows.filter((row) => row.getIsSelected())
    if (rowsToDelete.length > 0) {
      setData((data) =>
        data.filter((i) => rowsToDelete.some((row) => row.id !== i.externalId)),
      )
    }
  }, [table])

  const onSubmitTransactions = useCallback(() => {
    mutate(
      data.map((i) => ({
        ...i,
        accountId: i.account?.id,
        categoryId: i.category?.id,
        householdId: i.household?.id,
      })),
    )
  }, [mutate, data])

  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={
                !table.getIsSomePageRowsSelected() &&
                !table.getIsAllPageRowsSelected()
              }>
              <Trash2Icon />
              Delete Selected
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are sure you want to delete the selected transactions?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action will delete the processed transactions. If you want
                the undo this action, you will have to restart the upload.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteTransactions} asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <TransactionsTable table={table} />

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>

        <Button onClick={onSubmitTransactions} disabled={isPending}>
          Upload Transactions
        </Button>
      </div>
    </div>
  )
}
