import { capitalize } from 'lodash'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { ReactNode } from 'react'

import { Toaster } from '~/components/ui/sonner'
import { APP_DESCRIPTION, APP_KEYWORDS, APP_NAME } from '~/lib/app-metadata'
import { cn } from '~/lib/utils'
import { RootProvider } from '~/providers/root-provider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: capitalize(APP_NAME),
  description: APP_DESCRIPTION,
  keywords: APP_KEYWORDS,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(geistSans.variable, geistMono.variable, 'antialiased')}>
        <RootProvider>
          {children}
          <Toaster
            duration={5000}
            closeButton
            richColors
            position="top-right"
          />
        </RootProvider>
      </body>
    </html>
  )
}
