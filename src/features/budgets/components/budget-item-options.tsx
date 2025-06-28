import { IconPencil, IconTrash } from '@tabler/icons-react'
import type { ComponentProps } from 'react'

import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import type { BudgetSummary } from '../types'
import { DeleteBudgetDialog } from './delete-budget-dialog'
import { UpdateBudgetDialog } from './update-budget-dialog'

interface BudgetItemOptionsProps
  extends Pick<ComponentProps<'div'>, 'className'> {
  budget: BudgetSummary
}

function BudgetItemOptions({ budget, className }: BudgetItemOptionsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <UpdateBudgetDialog
        budget={budget}
        trigger={
          <Button variant="ghost" size="icon">
            <IconPencil />
            <span className="sr-only">Edit budget</span>
          </Button>
        }
        refreshOnSuccess
      />
      <DeleteBudgetDialog
        budget={budget}
        trigger={
          <Button variant="destructive-ghost" size="icon">
            <IconTrash />
            <span className="sr-only">Delete budget</span>
          </Button>
        }
        refreshOnSuccess
      />
    </div>
  )
}

export { BudgetItemOptions }
