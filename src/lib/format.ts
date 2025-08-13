import { CURRENCIES, type CurrencyCode } from '~/data/currencies'

function getLocaleFromCurrency(currency: (typeof CURRENCIES)[number]['code']) {
  return CURRENCIES.find((item) => item.code === currency)?.locale
}

function getCurrencyFormatter(
  currency: (typeof CURRENCIES)[number]['code'],
  options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'>,
) {
  const locale = getLocaleFromCurrency(currency)
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options,
  })
}

function formatAmount(
  amount: Intl.StringNumericLiteral | number,
  currency: CurrencyCode,
) {
  const formatter = getCurrencyFormatter(currency)
  return formatter.format(amount)
}

export { formatAmount, getCurrencyFormatter }
