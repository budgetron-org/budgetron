import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import {
  Currencies,
  type Currency,
  type TransactionType,
} from '~/server/db/enums'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function assertContextExists(value: unknown, message: string): asserts value {
  if (value == null) {
    throw new Error(message)
  }
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

function toUTCString(date: Date) {
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

function toTransactionType(type: 'income' | 'spending'): TransactionType {
  return type === 'income' ? 'income' : 'expense'
}

function extractFromFormData(formData: FormData) {
  return Object.fromEntries(
    formData.entries().map(([key, value]) => [key, value.toString()]),
  )
}

export {
  assertContextExists,
  cn,
  extractFromFormData,
  safeParseCurrency,
  safeParseNumber,
  toTransactionType,
  toUTCString,
}
