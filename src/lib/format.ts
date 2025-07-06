import { CURRENCIES } from '~/data/currencies'

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

export { getCurrencyFormatter }
