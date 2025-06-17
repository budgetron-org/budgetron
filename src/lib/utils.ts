import { clsx, type ClassValue } from 'clsx'
import { format, parse } from 'date-fns'
import { twMerge } from 'tailwind-merge'
import { Currencies, type Currency } from '~/server/db/enums'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function safeParseNumber(mayBeNumber: unknown, fallback: number = 0) {
  if (typeof mayBeNumber === 'number') return mayBeNumber
  if (mayBeNumber == null || typeof mayBeNumber !== 'string') return fallback

  const numberOrNaN = Number.parseFloat(mayBeNumber)
  return Number.isNaN(numberOrNaN) ? fallback : numberOrNaN
}

function safeParseCurrency(mayBeCurrency: unknown, fallback: Currency = 'USD') {
  if (Currencies.includes(mayBeCurrency as Currency))
    return mayBeCurrency as Currency
  return fallback
}

/**
 * Formats a month string to a human-readable label.
 *
 * @param monthString - Format: "YYYY-MM"
 * @returns Format: "MMMM yyyy"
 */
function formatMonthLabel(monthString: string) {
  const parsed = parse(monthString, 'yyyy-MM', new Date())
  return format(parsed, 'MMMM yyyy')
}

export { cn, formatMonthLabel, safeParseCurrency, safeParseNumber }
