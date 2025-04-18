'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { buttonVariants } from '~/components/ui/button'
import { APP_MAIN_NAV_LINKS } from '~/data/nav-links'
import { cn } from '~/lib/utils'

function NavItem({ children, href }: { children: string; href: string }) {
  const pathname = usePathname()
  const isActive = href.split('/')[1] === pathname.split('/')[1]
  return (
    <Link
      href={href}
      className={cn(
        'text-muted-foreground hover:text-primary text-sm font-medium transition-colors',
        buttonVariants({ variant: 'ghost' }),
        isActive && 'text-foreground',
      )}>
      {children}
    </Link>
  )
}

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn('flex items-center gap-2 lg:gap-4', className)}
      {...props}>
      {APP_MAIN_NAV_LINKS.map((props) => (
        <NavItem key={props.children} {...props} />
      ))}
    </nav>
  )
}
