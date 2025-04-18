import { clsx, type ClassValue } from 'clsx'
import { iconNames, type IconName } from 'lucide-react/dynamic'
import { twMerge } from 'tailwind-merge'

import {
  Currencies,
  type Currency,
  type TransactionType,
} from '~/server/db/enums'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function assertContextExists(
  value: unknown,
  message: string,
): asserts value {
  if (value == null) {
    throw new Error(message)
  }
}

export function safeParseLucideIcon(icon: string, fallback: IconName = 'ban') {
  if (iconNames.includes(icon as IconName)) return icon as IconName
  return fallback
}

export function safeParseNumber(mayBeNumber: unknown, fallback: number = 0) {
  if (typeof mayBeNumber === 'number') return mayBeNumber
  if (mayBeNumber == null || typeof mayBeNumber !== 'string') return fallback

  const numberOrNaN = Number.parseInt(mayBeNumber)
  return Number.isNaN(numberOrNaN) ? fallback : numberOrNaN
}

export function safeParseCurrency(
  mayBeCurrency: unknown,
  fallback: Currency = 'USD',
) {
  if (Currencies.includes(mayBeCurrency as Currency))
    return mayBeCurrency as Currency
  return fallback
}

export function toUTCString(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    ),
  ).toISOString()
}

export function toTransactionType(
  type: 'income' | 'spending',
): TransactionType {
  return type === 'income' ? 'income' : 'expense'
}

export function extractFromFormData(formData: FormData) {
  return Object.fromEntries(
    formData.entries().map(([key, value]) => [key, value.toString()]),
  )
}
