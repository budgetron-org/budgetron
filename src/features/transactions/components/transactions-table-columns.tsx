'use client'

import { IconDots, IconNotes, IconPencil, IconTrash } from '@tabler/icons-react'

import {
  DataTableColumnHeader,
  type ColumnDef,
  type Table,
} from '~/components/table'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { CategoryPicker } from '~/components/widgets/category-picker'
import { TransactionTypePicker } from '~/components/widgets/transaction-type-picker'
import type { TransactionWithRelations } from '~/features/transactions/types'
import { cn, safeParseNumber } from '~/lib/utils'
import { DeleteTransactionDialog } from './delete-transaction-dialog'
import { UpdateTransactionDialog } from './update-transaction-dialog'
import type { TableMeta } from '@tanstack/react-table'
import { Textarea } from '~/components/ui/textarea'
import { TagsInput } from '~/components/ui/tags-input'
import { isEqual } from 'lodash'

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

function getFormattedAmount<Data>(table: Table<Data>, value: string) {
  return (
    table.options.meta?.currencyFormatter.format(safeParseNumber(value)) ??
    String(value)
  )
}

function getColumns<Data extends TransactionWithRelations>() {
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
        return <div className="capitalize">{row.original.description}</div>
      },
    },
    {
      id: 'amount' as const,
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row, table }) => {
        return (
          <div
            className={cn(
              row.original.type === 'INCOME' && 'text-success',
              row.original.type === 'EXPENSE' && 'text-destructive',
            )}>
            {getFormattedAmount(table, row.original.amount)}
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
              onValueChange={(value) => {
                // do not update if the value is not different
                if (value === row.original.type) return
                table.options.meta?.updateCellData?.(
                  row.index,
                  'type',
                  value as Data['type'],
                )
              }}
            />
          )
        }
        return (
          <Badge
            variant={
              row.original.type === 'EXPENSE' ? 'destructive' : 'success'
            }>
            {row.original.type}
          </Badge>
        )
      },
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
              defaultValue={row.original.category?.id}
              onValueChange={(value) => {
                // do not update if the value is not different
                if (value === row.original.category?.id) return
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
    },
    {
      id: 'account' as const,
      accessorKey: 'account',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Account" />
      ),
      cell: ({ row }) =>
        row.original.bankAccount && (
          <Badge>
            {row.original.bankAccount.name} - {row.original.bankAccount.type}
          </Badge>
        ),
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
    },
    {
      id: 'actions' as const,
      cell: ({ row, table }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">More options</span>
              <IconDots className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {isActionEnabled(table, 'edit') && (
              <UpdateTransactionDialog
                transaction={row.original}
                trigger={
                  <DropdownMenuItem preventClosing>
                    <IconPencil />
                    Edit
                  </DropdownMenuItem>
                }
                refreshOnSuccess
              />
            )}
            {isActionEnabled(table, 'delete') && (
              <DeleteTransactionDialog
                transaction={row.original}
                trigger={
                  <DropdownMenuItem preventClosing>
                    <IconTrash className="text-destructive" />
                    Delete
                  </DropdownMenuItem>
                }
                refreshOnSuccess
              />
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ] satisfies ColumnDef<Data>[]
}

type ColumnId = ReturnType<
  typeof getColumns<TransactionWithRelations>
>[number]['id']

export { getColumns }
export type { ColumnId }
