'use client'

import {
  IconLayoutDashboard,
  IconReportAnalytics,
  IconTransactionDollar,
} from '@tabler/icons-react'
import { NavMenu } from '~/components/layout/nav-menu'

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
    title: 'Reports',
    url: '/reports',
    icon: IconReportAnalytics,
  },
]

function NavMain() {
  return <NavMenu items={items} />
}

export { NavMain }
