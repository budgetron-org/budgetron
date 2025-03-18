import type { Currency, TransactionType } from '@prisma/client'
import { clsx, type ClassValue } from 'clsx'
import { iconNames, type IconName } from 'lucide-react/dynamic'
import { twMerge } from 'tailwind-merge'

import { CurrencySchema } from '@/prisma/schemas'

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
  const { data, success } = CurrencySchema.safeParse(mayBeCurrency)
  return success ? data : fallback
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
