'use client'

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import type { ComponentProps } from 'react'

import { cn } from '~/lib/utils'

function ScrollArea({
  className,
  children,
  hasCustomViewPort,
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  hasCustomViewPort?: boolean
}) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn('relative', className)}
      {...props}>
      {hasCustomViewPort ? (
        children
      ) : (
        <ScrollAreaViewPort data-slot="scroll-area-viewport">
          {children}
        </ScrollAreaViewPort>
      )}
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollAreaViewPort({
  className,
  children,
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.Viewport>) {
  return (
    <ScrollAreaPrimitive.Viewport
      data-slot="scroll-area-viewport"
      className={cn(
        'ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1',
        className,
      )}
      {...props}>
      {children}
    </ScrollAreaPrimitive.Viewport>
  )
}

function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        'flex touch-none p-px transition-colors select-none',
        orientation === 'vertical' &&
          'h-full w-2.5 border-l border-l-transparent',
        orientation === 'horizontal' &&
          'h-2.5 flex-col border-t border-t-transparent',
        className,
      )}
      {...props}>
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollAreaViewPort, ScrollBar }
