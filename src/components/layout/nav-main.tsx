'use client'

import {
  IconCalendarDollar,
  IconLayoutDashboard,
  IconReportAnalytics,
  IconTransactionDollar,
} from '@tabler/icons-react'

import { NavMenu } from '~/components/layout/nav-menu'
import { PATHS } from '~/data/routes'

const items = [
  {
    title: 'Dashboard',
    url: PATHS.DASHBOARD,
    icon: IconLayoutDashboard,
  },
  {
    title: 'Transactions',
    url: PATHS.TRANSACTIONS,
    icon: IconTransactionDollar,
  },
  {
    title: 'Budgets',
    url: PATHS.BUDGETS,
    icon: IconCalendarDollar,
  },
  {
    title: 'Reports',
    url: PATHS.REPORTS,
    icon: IconReportAnalytics,
  },
]

function NavMain() {
  return <NavMenu items={items} />
}

export { NavMain }
