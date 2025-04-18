'use client'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'
import { type ReactNode } from 'react'

import { TRPCReactProvider } from '~/trpc/client'
import { HouseholdProvider } from './household-provider'

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <TRPCReactProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
        <HouseholdProvider>{children}</HouseholdProvider>
      </ThemeProvider>
      <ReactQueryDevtools />
    </TRPCReactProvider>
  )
}
