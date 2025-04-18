import { BrandLogo } from '~/components/brand-logo'
import { ModeToggle } from '~/components/mode-toggle'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { MainNav } from './main-nav'
import { MainSideBar } from './main-sidebar'
import { UserNav } from './user-nav'

function DesktopHeader() {
  return (
    <div className="hidden h-full items-center gap-4 px-8 md:flex lg:gap-6">
      <BrandLogo href="/dashboard" />
      <MainNav />
      <div className="ml-auto flex items-center gap-4">
        <ModeToggle />
        <UserNav />
      </div>
    </div>
  )
}

function MobileHeader() {
  return (
    <div className="flex h-full flex-1 items-center justify-center md:hidden">
      <MainSideBar />
      <SidebarTrigger size="lg" className="absolute left-2 h-8 w-8" />
      <BrandLogo href="/dashboard" />
      <UserNav className="absolute right-2" />
    </div>
  )
}

export function Header() {
  return (
    <header className="sticky min-h-16 w-full border-b">
      <DesktopHeader />
      <MobileHeader />
    </header>
  )
}
