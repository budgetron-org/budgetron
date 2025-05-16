import type { Currency } from '~/server/db/enums'

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'Dollar', locale: 'en-US' },
  { code: 'INR', symbol: '₹', name: 'Rupee', locale: 'en-IN' },
] as const

function getLocaleFromCurrency(currency: Currency) {
  return CURRENCIES.find((item) => item.code === currency)?.locale
}

function getCurrencyFormatter(currency: Currency) {
  const locale = getLocaleFromCurrency(currency)
  return new Intl.NumberFormat(locale, { style: 'currency', currency })
}

export { getCurrencyFormatter }
