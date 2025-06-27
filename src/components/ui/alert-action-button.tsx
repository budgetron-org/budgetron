'use client'

import { Slot as SlotPrimitive } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'

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
  alertContent?: ReactNode
  alertConfirmText?: string
  alertCancelText?: string
  alertConfirmVariant?: ComponentProps<typeof Button>['variant']
  onConfirm?: () => void
}

function AlertActionButton({
  asChild,
  alertTitle = 'Are you sure?',
  alertDescription = 'This action cannot be undone.',
  alertContent,
  alertConfirmText = 'Confirm',
  alertCancelText = 'Cancel',
  alertConfirmVariant = 'default',
  onConfirm,
  ...props
}: AlertActionButtonProps) {
  const Comp = asChild ? SlotPrimitive.Slot : ProgressButton
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
        {alertContent}
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="secondary">{alertCancelText}</Button>
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} asChild>
            <Button variant={alertConfirmVariant}>{alertConfirmText}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { AlertActionButton }
