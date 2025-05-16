import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Currencies, type Currency } from '~/server/db/enums'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function safeParseNumber(mayBeNumber: unknown, fallback: number = 0) {
  if (typeof mayBeNumber === 'number') return mayBeNumber
  if (mayBeNumber == null || typeof mayBeNumber !== 'string') return fallback

  const numberOrNaN = Number.parseInt(mayBeNumber)
  return Number.isNaN(numberOrNaN) ? fallback : numberOrNaN
}

function safeParseCurrency(mayBeCurrency: unknown, fallback: Currency = 'USD') {
  if (Currencies.includes(mayBeCurrency as Currency))
    return mayBeCurrency as Currency
  return fallback
}

export { cn, safeParseCurrency, safeParseNumber }
