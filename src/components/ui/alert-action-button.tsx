'use client'

import { Slot as SlotPrimitive } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'

import { Button } from '~/components/ui/button'
import { ProgressButton } from '~/components/ui/progress-button'
import { DialogDrawer, DialogDrawerClose } from './dialog-drawer'

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
    <DialogDrawer
      trigger={<Comp {...props} />}
      title={alertTitle}
      description={alertDescription}
      footer={
        <>
          <DialogDrawerClose asChild>
            <Button variant="secondary">{alertCancelText}</Button>
          </DialogDrawerClose>
          <DialogDrawerClose onClick={onConfirm} asChild>
            <Button variant={alertConfirmVariant}>{alertConfirmText}</Button>
          </DialogDrawerClose>
        </>
      }>
      {alertContent}
    </DialogDrawer>
  )
}

export { AlertActionButton }
