'use client'

import { IconSlash } from '@tabler/icons-react'
import { startCase } from 'lodash'
import { usePathname } from 'next/navigation'
import { Fragment, useMemo } from 'react'

import { NavModeToggle } from '~/components/layout/nav-mode-toggle'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { Separator } from '~/components/ui/separator'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { PATH_TITLE_MAP } from '~/data/routes'

function useBreadcrumbs() {
  // get path name without the leading /
  const pathname = usePathname().slice(1)

  return useMemo(() => {
    // If a title is specified, then use that
    if (pathname in PATH_TITLE_MAP) {
      return PATH_TITLE_MAP[pathname as keyof typeof PATH_TITLE_MAP]
    }

    // handle special cases
    // path is /dashboard/budget/:budgetId
    if (
      /^dashboard\/budgets\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
        pathname,
      )
    ) {
      return PATH_TITLE_MAP['dashboard/budgets/:budgetId']
    }

    // If no title is specified, then return path bits as
    // crumbs
    return pathname.split('/').map(startCase)
  }, [pathname])
}

function AppHeader() {
  const breadcrumbs = useBreadcrumbs()

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) =>
              index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage key={item} className="text-xl font-medium">
                  {item}
                </BreadcrumbPage>
              ) : (
                <Fragment key={item}>
                  <BreadcrumbItem className="text-xl font-medium">
                    {item}
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <IconSlash />
                  </BreadcrumbSeparator>
                </Fragment>
              ),
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <NavModeToggle className="ml-auto" />
      </div>
    </header>
  )
}

export { AppHeader }
