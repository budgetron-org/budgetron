import { IconDots, IconPencil, IconTrash } from '@tabler/icons-react'

import type { ComponentProps } from 'react'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { cn } from '~/lib/utils'
import type { BudgetSummary } from '../types'
import { DeleteBudgetDialog } from './delete-budget-dialog'
import { UpdateBudgetDialog } from './update-budget-dialog'

interface BudgetItemOptionsProps extends ComponentProps<typeof Button> {
  budget: BudgetSummary
}

function BudgetItemOptions({
  budget,
  className,
  ...props
}: BudgetItemOptionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn('h-8 w-8 p-0', className)}
          {...props}>
          <span className="sr-only">More options</span>
          <IconDots className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <UpdateBudgetDialog
          budget={budget}
          trigger={
            <DropdownMenuItem preventClosing>
              <IconPencil />
              Edit
            </DropdownMenuItem>
          }
          refreshOnSuccess
        />
        <DeleteBudgetDialog
          budget={budget}
          trigger={
            <DropdownMenuItem preventClosing>
              <IconTrash className="text-destructive" />
              Delete
            </DropdownMenuItem>
          }
          refreshOnSuccess
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { BudgetItemOptions }
