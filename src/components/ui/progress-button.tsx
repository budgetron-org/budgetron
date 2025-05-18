'use client'

import { IconLoader2 } from '@tabler/icons-react'
import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

const progressButtonVariants = cva('grid items-center', {
  variants: {
    textAlign: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    },
  },
  defaultVariants: {
    textAlign: 'center',
  },
})

function ProgressButton({
  children,
  isLoading,
  disabled,
  textAlign,
  ...props
}: ComponentProps<typeof Button> & {
  isLoading?: boolean
  textAlign?: 'start' | 'center' | 'end'
}) {
  return (
    <Button {...props} disabled={disabled || isLoading}>
      <div className={cn(progressButtonVariants({ textAlign }))}>
        <div
          className={cn(
            'col-start-1 col-end-2 row-start-1 row-end-2 inline-flex items-center justify-center gap-2',
            isLoading ? 'invisible' : 'visible',
          )}>
          {children}
        </div>
        <div
          className={cn(
            'col-start-1 col-end-2 row-start-1 row-end-2',
            isLoading ? 'visible' : 'invisible',
          )}>
          <IconLoader2 className="mx-auto animate-spin" />
        </div>
      </div>
    </Button>
  )
}

export { ProgressButton }
