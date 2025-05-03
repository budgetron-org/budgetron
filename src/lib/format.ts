import { CURRENCIES, type Currency } from '~/data/currencies'

function getLocaleFromCurrency(currency: Currency['code']) {
  return CURRENCIES.find((item) => item.code === currency)?.locale
}

function getCurrencyFormatter(currency: Currency['code']) {
  const locale = getLocaleFromCurrency(currency)
  return new Intl.NumberFormat(locale, { style: 'currency', currency })
}

function getPercentFormatter(locale: Intl.LocalesArgument) {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 2,
  })
}

export { getCurrencyFormatter, getLocaleFromCurrency, getPercentFormatter }
