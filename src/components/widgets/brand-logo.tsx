import { capitalize } from 'lodash'
import Image from 'next/image'

import { APP_NAME } from '~/lib/app-metadata'
import { cn } from '~/lib/utils'

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

interface BrandLogoProps {
  href?: string
  isIconOnly?: boolean
  size?: keyof (typeof SIZE_CLASS)[keyof typeof SIZE_CLASS]
}

function BrandLogo({ href, isIconOnly = false, size = 'md' }: BrandLogoProps) {
  const Comp = href ? 'a' : 'div'
  return (
    <Comp href={href} className="flex items-center gap-2">
      <div
        className={cn(
          'relative aspect-square overflow-hidden rounded-lg',
          SIZE_CLASS.ICON[size],
        )}>
        <Image src="/images/logo.png" alt={APP_NAME} fill />
      </div>
      {!isIconOnly && (
        <div className={cn('flex-1', SIZE_CLASS.TEXT[size])}>
          <span className="font-bold">{capitalize(APP_NAME)}</span>
        </div>
      )}
    </Comp>
  )
}

export { BrandLogo }
