import { DynamicIcon } from 'lucide-react/dynamic'

import { cn, safeParseLucideIcon } from '~/lib/utils'

type CategoryIconProps = {
  className?: string
  icon: string
}
export function CategoryIcon({ className, icon }: CategoryIconProps) {
  return (
    <span
      className={cn(
        'bg-primary inline-flex h-8 w-8 items-center justify-center rounded-full text-white',
        className,
      )}>
      <DynamicIcon
        name={safeParseLucideIcon(icon)}
        className="h-4 w-4"
        strokeWidth={3}
      />
    </span>
  )
}
