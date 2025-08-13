'use client'

import {
  IconInfoCircle,
  IconNotes,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react'
import type { TableMeta } from '@tanstack/react-table'
import { isEqual } from 'lodash'

import { BankAccountPicker } from '~/components/pickers/bank-account-picker'
import { CategoryPicker } from '~/components/pickers/category-picker'
import { TransactionTypePicker } from '~/components/pickers/transaction-type-picker'
import {
  DataTableColumnHeader,
  type ColumnDef,
  type Table,
} from '~/components/table'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { TagsInput } from '~/components/ui/tags-input'
import { Textarea } from '~/components/ui/textarea'
import { DeleteTransactionDialog } from '~/features/transactions/components/delete-transaction-dialog'
import { UpdateTransactionDialog } from '~/features/transactions/components/update-transaction-dialog'
import type { DetailedTransaction } from '~/features/transactions/types'
import { formatAmount } from '~/lib/format'
import { cn, safeParseNumber } from '~/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { format } from 'date-fns'

function isEditableColumn<Data>(table: Table<Data>, accessor: keyof Data) {
  const editable = table.options.meta?.editable
  if (typeof editable === 'boolean') return editable
  return !!editable?.[accessor]
}

function isActionEnabled<Data>(
  table: Table<Data>,
  action: keyof Extract<TableMeta<Data>['actions'], object>,
) {
  const actions = table.options.meta?.actions
  if (typeof actions === 'boolean') return actions
  return !!actions?.[action]
}

function isRefundTransaction(tx: DetailedTransaction) {
  return tx.type === 'EXPENSE' && tx.cashFlow === 'IN'
}

function negateAmount(amount: string) {
  const result = Math.abs(safeParseNumber(amount)) * -1
  return result.toString()
}

function unNegateAmount(amount: string) {
  const result = Math.abs(safeParseNumber(amount))
  return result.toString()
}

function getColumns<Data extends DetailedTransaction = DetailedTransaction>() {
  return [
    {
      id: 'select' as const,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
    },
    {
      id: 'date' as const,
      accessorKey: 'date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.date)
        return (
          <div className="text-muted-foreground">
            {date.toLocaleDateString('default', {
              timeZone: 'UTC',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </div>
        )
      },
    },
    {
      id: 'description' as const,
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row, table }) => {
        if (isEditableColumn(table, 'description')) {
          return (
            <Input
              aria-label="Description"
              defaultValue={row.original.description}
              onBlur={(event) => {
                const value = event.target.value
                // do not update if the value is not different
                if (value === row.original.description) return
                table.options.meta?.updateCellData?.(
                  row.index,
                  'description',
                  value as Data['description'],
                )
              }}
            />
          )
        }
        return (
          <div className="flex gap-2">
            {isRefundTransaction(row.original) && (
              <Badge variant="success">Refund</Badge>
            )}
            <span className="capitalize">{row.original.description}</span>
          </div>
        )
      },
    },
    {
      id: 'amount' as const,
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row, table }) => {
        const { currencyExchangeDetails, type, amount, currency } = row.original
        return (
          <div
            className={cn(
              'flex items-center gap-2',
              type === 'INCOME' && 'text-success',
              type === 'EXPENSE' &&
                (isRefundTransaction(row.original)
                  ? 'text-success'
                  : 'text-destructive'),
            )}>
            {formatAmount(amount, currency)}
            {/* Add conversion details if the tx currency is not the base currency */}
            {currency !== table.options.meta?.baseCurrency && (
              <Tooltip>
                <TooltipTrigger className="text-muted-foreground">
                  <IconInfoCircle size={20} />
                </TooltipTrigger>
                <TooltipContent className="flex flex-col gap-2">
                  {currencyExchangeDetails.hasConversionRate && (
                    <>
                      <span className="flex items-center gap-2 text-sm">
                        In {table.options.meta?.baseCurrency ?? 'Base Currency'}
                        :{' '}
                        {formatAmount(
                          currencyExchangeDetails.amountInBaseCurrency,
                          currencyExchangeDetails.baseCurrency,
                        )}
                        <span className="text-muted-foreground text-xs">
                          (as of{' '}
                          {format(currencyExchangeDetails.date, 'MMM dd, yyyy')}
                          )
                        </span>
                      </span>
                    </>
                  )}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )
      },
    },
    {
      id: 'type' as const,
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row, table }) => {
        if (isEditableColumn(table, 'type')) {
          return (
            <TransactionTypePicker
              aria-label="Transaction Type"
              defaultValue={row.original.type}
              disabledOptions={[
                row.original.cashFlow === 'OUT' && 'INCOME', // Income cannot be cash flow out
              ].filter(Boolean)}
              onValueChange={(value) => {
                // do not update if the value is not different
                if (value === row.original.type) return

                // when changing to TRANSFER, set fromBankAccountId and toBankAccountId based on the
                // cash flow direction.
                // 1. IN -> fromBankAccountId = null, toBankAccountId = bankAccountId
                // 2. OUT -> fromBankAccountId = bankAccountId, toBankAccountId = null
                if (value === 'TRANSFER') {
                  table.options.meta?.updateRowData?.(row.index, {
                    ...row.original,
                    type: value,
                    fromBankAccountId:
                      row.original.cashFlow === 'OUT'
                        ? row.original.bankAccountId
                        : null,
                    toBankAccountId:
                      row.original.cashFlow === 'IN'
                        ? row.original.bankAccountId
                        : null,
                  })
                  return
                }

                // when changing to expense/income, set fromBankAccountId and toBankAccountId to null
                // also, update the amount based on the cash flow direction and type - refunds are represented by negative expenses
                // 1. IN & INCOME -> amount = amount
                // 2. IN & EXPENSE (refund) -> amount = negate(amount)
                // 3. OUT & EXPENSE -> amount = amount
                table.options.meta?.updateRowData?.(row.index, {
                  ...row.original,
                  type: value,
                  fromBankAccountId: null,
                  toBankAccountId: null,
                  // use the new value to figure out if this will be a refund transaction
                  amount: isRefundTransaction({
                    ...row.original,
                    type: value,
                  })
                    ? negateAmount(row.original.amount)
                    : unNegateAmount(row.original.amount),
                })
              }}
            />
          )
        }
        return (
          <Badge
            variant={
              row.original.type === 'EXPENSE'
                ? 'destructive'
                : row.original.type === 'INCOME'
                  ? 'success'
                  : 'default'
            }>
            {row.original.type}
          </Badge>
        )
      },
      filterFn: 'arrIncludesSome',
    },
    {
      id: 'category' as const,
      accessorKey: 'category',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row, table }) => {
        if (isEditableColumn(table, 'category')) {
          return (
            <CategoryPicker
              aria-label="Category"
              placeholder="Select Category"
              type={row.original.type}
              defaultValue={row.original.categoryId ?? undefined}
              onValueChange={(value) => {
                // do not update if the value is not different
                if (value === row.original.categoryId) return
                table.options.meta?.updateCellData?.(
                  row.index,
                  'categoryId',
                  value as Data['categoryId'],
                )
              }}
            />
          )
        }

        return (
          row.original.category && (
            <div className="flex items-center gap-2">
              {row.original.category.parent && (
                <>{row.original.category.parent.name} - </>
              )}
              {row.original.category.name}
            </div>
          )
        )
      },
      filterFn: (row, _, filterValue) => {
        if (Array.isArray(filterValue) && filterValue.length > 0) {
          return filterValue.includes(row.original.categoryId)
        }
        // Unsupported filter or no filter, return unfiltered
        return true
      },
    },
    {
      id: 'bankAccount' as const,
      accessorKey: 'bankAccount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Account" />
      ),
      cell: ({ row }) =>
        row.original.bankAccount && (
          <>
            {row.original.bankAccount.name} - {row.original.bankAccount.type}
          </>
        ),
      filterFn: (row, _, filterValue) => {
        if (Array.isArray(filterValue) && filterValue.length > 0) {
          return filterValue.includes(row.original.bankAccountId)
        }
        // Unsupported filter or no filter, return unfiltered
        return true
      },
    },
    {
      id: 'fromAccount' as const,
      accessorKey: 'fromAccount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="From Account" />
      ),
      cell: ({ row, table }) => {
        // From Account should only be editable if:
        // 1. It is configured to be editable
        // 2. The row represents a transfer transaction
        if (
          isEditableColumn(table, 'fromBankAccount') &&
          row.original.type === 'TRANSFER'
        ) {
          return (
            <BankAccountPicker
              // disable changing if the money is moving out of this account
              disabled={row.original.cashFlow === 'OUT'}
              aria-label="From Account"
              placeholder="Select From Account"
              defaultValue={row.original.fromBankAccountId ?? undefined}
              onValueChange={(value) => {
                // do not update if the value is not different
                if (value === row.original.fromBankAccountId) return
                table.options.meta?.updateCellData?.(
                  row.index,
                  'fromBankAccountId',
                  value as Data['fromBankAccountId'],
                )
              }}
            />
          )
        }
        return (
          row.original.fromBankAccount && (
            <>
              {row.original.fromBankAccount.name} -{' '}
              {row.original.fromBankAccount.type}
            </>
          )
        )
      },
      filterFn: (row, _, filterValue) => {
        if (Array.isArray(filterValue) && filterValue.length > 0) {
          return filterValue.includes(row.original.fromBankAccountId)
        }
        // Unsupported filter or no filter, return unfiltered
        return true
      },
    },
    {
      id: 'toAccount' as const,
      accessorKey: 'toAccount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="To Account" />
      ),
      cell: ({ row, table }) => {
        // From Account should only be editable if:
        // 1. It is configured to be editable
        // 2. The row represents a transfer transaction
        if (
          isEditableColumn(table, 'toBankAccount') &&
          row.original.type === 'TRANSFER'
        ) {
          return (
            <BankAccountPicker
              // disable changing if the money is moving into this account
              disabled={row.original.cashFlow === 'IN'}
              aria-label="To Account"
              placeholder="Select To Account"
              defaultValue={row.original.toBankAccountId ?? undefined}
              onValueChange={(value) => {
                // do not update if the value is not different
                if (value === row.original.toBankAccountId) return
                table.options.meta?.updateCellData?.(
                  row.index,
                  'toBankAccountId',
                  value as Data['toBankAccountId'],
                )
              }}
            />
          )
        }

        return (
          row.original.toBankAccount && (
            <>
              {row.original.toBankAccount.name} -{' '}
              {row.original.toBankAccount.type}
            </>
          )
        )
      },
      filterFn: (row, _, filterValue) => {
        if (Array.isArray(filterValue) && filterValue.length > 0) {
          return filterValue.includes(row.original.toBankAccountId)
        }
        // Unsupported filter or no filter, return unfiltered
        return true
      },
    },
    {
      id: 'notes' as const,
      accessorKey: 'notes',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Notes" />
      ),
      cell: ({ row, table }) => {
        if (isEditableColumn(table, 'notes')) {
          return (
            <Textarea
              aria-label="Notes"
              defaultValue={row.original.notes ?? ''}
              onBlur={(event) => {
                const value = event.target.value
                // do not update if the value is not different
                if (value === (row.original.notes ?? '')) return
                table.options.meta?.updateCellData?.(
                  row.index,
                  'notes',
                  value as Data['notes'],
                )
              }}
            />
          )
        }
        return (
          row.original.notes && (
            <div className="flex gap-2">
              <IconNotes className="text-muted-foreground" />
              {row.original.notes}
            </div>
          )
        )
      },
    },
    {
      id: 'tags' as const,
      accessorKey: 'tags',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tags" />
      ),
      cell: ({ row, table }) => {
        if (isEditableColumn(table, 'tags')) {
          return (
            <TagsInput
              aria-label="Tags"
              value={row.original.tags ?? []}
              onValueChange={(value) => {
                // do not update if the tags are not different
                if (isEqual(row.original.tags, value)) return
                table.options.meta?.updateCellData?.(
                  row.index,
                  'tags',
                  value as Data['tags'],
                )
              }}
            />
          )
        }
        return (
          row.original.tags && (
            <div className="flex gap-2">
              {row.original.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          )
        )
      },
      filterFn: 'arrIncludesSome',
    },
    {
      id: 'actions' as const,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row, table }) => (
        <div className="opacity-100 group-hover:opacity-100 md:opacity-0">
          {isActionEnabled(table, 'edit') && (
            <UpdateTransactionDialog
              transaction={row.original}
              trigger={
                <Button variant="ghost" size="icon">
                  <IconPencil />
                  <span className="sr-only">Edit Transaction</span>
                </Button>
              }
              refreshOnSuccess
            />
          )}
          {isActionEnabled(table, 'delete') && (
            <DeleteTransactionDialog
              transaction={row.original}
              trigger={
                <Button variant="ghost" size="icon">
                  <IconTrash className="text-destructive" />
                  <span className="sr-only">Delete Transaction</span>
                </Button>
              }
              refreshOnSuccess
            />
          )}
        </div>
      ),
    },
  ] satisfies ColumnDef<Data>[]
}

type ColumnId = ReturnType<typeof getColumns>[number]['id']

export { getColumns }
export type { ColumnId }
