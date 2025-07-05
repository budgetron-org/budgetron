import { useState, type ComponentProps } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/ui/drawer'
import { useIsMobile } from '~/hooks/use-is-mobile'

interface DialogDrawerProps {
  title?: string
  description?: string
  trigger: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function DialogDrawer({
  title,
  description,
  trigger,
  children,
  footer,
  open,
  onOpenChange,
}: DialogDrawerProps) {
  const [openState, setOpenState] = useState(false)
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer
        open={open ?? openState}
        onOpenChange={onOpenChange ?? setOpenState}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="p-6">
          <DrawerHeader className="px-0">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          {children}
          {footer && <DrawerFooter className="px-0">{footer}</DrawerFooter>}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog
      open={open ?? openState}
      onOpenChange={onOpenChange ?? setOpenState}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}

interface DialogDrawerCloseProps
  extends ComponentProps<typeof DialogClose>,
    ComponentProps<typeof DrawerClose> {}

function DialogDrawerClose(props: DialogDrawerCloseProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <DrawerClose {...props} />
  }
  return <DialogClose {...props} />
}

export { DialogDrawer, DialogDrawerClose }
