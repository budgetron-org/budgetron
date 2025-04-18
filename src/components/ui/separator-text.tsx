import type { ComponentProps } from 'react'

import { cn } from '~/lib/utils'

function SeparatorText({ className, ...props }: ComponentProps<'span'>) {
  return (
    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
      <span
        className={cn(
          'bg-background text-muted-foreground relative z-10 px-2',
          className,
        )}
        {...props}
      />
    </div>
  )
}

export { SeparatorText }
