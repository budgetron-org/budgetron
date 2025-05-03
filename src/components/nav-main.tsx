'use client'

import {
  IconCalendarDollar,
  IconLayoutDashboard,
  IconReportAnalytics,
  IconReportSearch,
  IconTransactionDollar,
} from '@tabler/icons-react'
import { NavMenu } from './nav-menu'

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: IconLayoutDashboard,
  },
  {
    title: 'Transactions',
    url: '/transactions',
    icon: IconTransactionDollar,
  },
  {
    title: 'Watchlist',
    url: '/watchlist',
    icon: IconReportSearch,
  },
  {
    title: 'Spending Plan',
    url: '/spending-plan',
    icon: IconCalendarDollar,
  },
  {
    title: 'Report',
    url: '/report',
    icon: IconReportAnalytics,
  },
]

function NavMain() {
  return <NavMenu items={items} />
}

export { NavMain }
