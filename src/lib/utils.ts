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

type Env = typeof import('~/env/server').env
function isGoogleAuthEnabled(env: Env): env is Env & {
  readonly GOOGLE_CLIENT_ID: string
  readonly GOOGLE_CLIENT_SECRET: string
} {
  return env.GOOGLE_CLIENT_ID != null && env.GOOGLE_CLIENT_SECRET != null
}

function isOAuthAuthEnabled(env: Env): env is Env & {
  readonly OAUTH_CLIENT_ID: string
  readonly OAUTH_CLIENT_SECRET: string
  readonly OAUTH_PROVIDER_NAME: string
  readonly OPENID_CONFIGURATION_URL: string
} {
  return (
    env.OAUTH_CLIENT_ID != null &&
    env.OAUTH_CLIENT_SECRET != null &&
    env.OAUTH_PROVIDER_NAME != null &&
    env.OPENID_CONFIGURATION_URL != null
  )
}

function getSupportedProviders(env: Env) {
  const providers: {
    providerId: 'google' | 'custom-oauth-provider'
    providerName: string
  }[] = []
  if (isGoogleAuthEnabled(env)) {
    providers.push({ providerId: 'google', providerName: 'Google' })
  }
  if (isOAuthAuthEnabled(env)) {
    providers.push({
      providerId: 'custom-oauth-provider',
      providerName: env.OAUTH_PROVIDER_NAME ?? 'OAuth',
    })
  }
  return providers
}

function getGravatarUrl(emailHash: string) {
  return `https://gravatar.com/avatar/${emailHash}?d=wavatar&s=100`
}

function getPlaceHolderAvatarUrl() {
  return 'https://gravatar.com/avatar/?d=mp&s=100'
}

function getInitials(name: string) {
  const [firstName, lastName] = name.split(' ') as [string, string | undefined]
  return (firstName[0] ?? '') + (lastName?.[0] ?? '')
}

function numericHashCode(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function getHSLColor(name: string) {
  const hash = numericHashCode(name)

  const hue = hash % 360

  // Derive saturation and lightness from hash, but clamp to nice ranges
  const saturation = 60 + (hash % 21) // 60–80%
  const lightness = 45 + ((hash >> 3) % 21) // 45–65%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

function getInitialsAvatarUrl(name: string) {
  const initials = getInitials(name)
  const backgroundColor = getHSLColor(name)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
      <rect width="100%" height="100%" fill="${backgroundColor}" />
      <text x="50%" y="50%" font-size="48" fill="white" font-family="sans-serif"
            text-anchor="middle" dominant-baseline="central">${initials}</text>
    </svg>
  `
  // Safely encode SVG to base64 using encodeURIComponent
  const utf8Encoded = encodeURIComponent(svg).replace(
    /%([0-9A-F]{2})/g,
    (_, hex) => String.fromCharCode(parseInt(hex, 16)),
  )
  const base64 = btoa(utf8Encoded)

  return `data:image/svg+xml;base64,${base64}`
}

export {
  cn,
  formatMonthLabel,
  getGravatarUrl,
  getInitialsAvatarUrl,
  getPlaceHolderAvatarUrl,
  getSupportedProviders,
  isGoogleAuthEnabled,
  isOAuthAuthEnabled,
  safeParseCurrency,
  safeParseNumber,
}
