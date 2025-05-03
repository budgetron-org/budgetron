import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { ReactNode } from 'react'

import { RootProvider } from '~/providers/root-provider'
import { Toaster } from '~/components/ui/sonner'
import { cn } from '~/lib/utils'
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
  title: 'Budgetify',
  description: 'Every Dollar Counts.',
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
          <Toaster duration={5000} closeButton richColors />
        </RootProvider>
      </body>
    </html>
  )
}
