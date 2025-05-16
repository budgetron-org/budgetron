'use client'

import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps } from 'react'

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
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { ProgressButton } from '~/components/ui/progress-button'

interface AlertActionButtonProps extends ComponentProps<typeof ProgressButton> {
  alertTitle?: string
  alertDescription?: string
  onConfirm?: () => void
}

function AlertActionButton({
  asChild,
  alertTitle = 'Are you sure?',
  alertDescription = 'This action cannot be undone.',
  onConfirm,
  ...props
}: AlertActionButtonProps) {
  const Comp = asChild ? Slot : ProgressButton
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Comp {...props} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
          <AlertDialogDescription>{alertDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="secondary">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} asChild>
            <Button>Confirm</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { AlertActionButton }
