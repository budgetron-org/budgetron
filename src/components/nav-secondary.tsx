'use client'

import { IconSettings } from '@tabler/icons-react'
import { NavMenu } from './nav-menu'

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
