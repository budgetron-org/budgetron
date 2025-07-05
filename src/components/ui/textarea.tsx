import type { ComponentProps } from 'react'

import { cn } from '~/lib/utils'

function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input placeholder:text-muted-foreground md:text-sm',
        'focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none',
        'aria-invalid:border-destructive aria-invalid:ring-destructive',
        'dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base',
        'shadow-xs transition-[color,box-shadow]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
