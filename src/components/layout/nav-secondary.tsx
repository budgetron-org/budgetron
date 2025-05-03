'use client'

import { IconSettings } from '@tabler/icons-react'
import { NavMenu } from '~/components/layout/nav-menu'

const items = [
  {
    title: 'Settings',
    url: '#',
    icon: IconSettings,
  },
]

function NavSecondary(props: { className?: string }) {
  return <NavMenu items={items} {...props} />
}

export { NavSecondary }
