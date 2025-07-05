import type { ComponentProps } from 'react'

import { cn } from '~/lib/utils'

function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-input file:text-foreground placeholder:text-muted-foreground',
        'selection:bg-primary selection:text-primary-foreground md:text-sm',
        'aria-invalid:border-destructive aria-invalid:ring-destructive',
        'flex h-9 w-full min-w-0 rounded-md border bg-transparent',
        'px-3 py-1 text-base shadow-xs transition-[color,box-shadow]',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
