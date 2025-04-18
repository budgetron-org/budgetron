import { cn } from '~/lib/utils'
import { PiggyBankIcon } from 'lucide-react'

const SIZE_CLASS = {
  ICON: {
    md: 'size-8',
    lg: 'size-12',
  },
  TEXT: {
    md: 'text-md',
    lg: 'text-2xl',
  },
}

type Props = {
  href?: string
  isIconOnly?: boolean
  size?: keyof (typeof SIZE_CLASS)[keyof typeof SIZE_CLASS]
}

export function BrandLogo({ href, isIconOnly = false, size = 'md' }: Props) {
  const Comp = href ? 'a' : 'div'
  return (
    <Comp href={href} className="flex items-center gap-2">
      <div
        className={cn(
          'bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square items-center justify-center rounded-lg',
          SIZE_CLASS.ICON[size],
        )}>
        <PiggyBankIcon />
      </div>
      {!isIconOnly && (
        <div className={cn('flex-1', SIZE_CLASS.TEXT[size])}>
          <span className="font-bold">Budgetify</span>
        </div>
      )}
    </Comp>
  )
}
