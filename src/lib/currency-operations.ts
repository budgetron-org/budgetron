import { Decimal } from 'decimal.js'

type CurrencyAmount = Intl.StringNumericLiteral | number

function add(a: CurrencyAmount, b: CurrencyAmount) {
  return new Decimal(a).add(b).toString() as Intl.StringNumericLiteral
}

function sub(a: CurrencyAmount, b: CurrencyAmount) {
  return new Decimal(a).sub(b).toString() as Intl.StringNumericLiteral
}

function mul(a: CurrencyAmount, b: CurrencyAmount) {
  return new Decimal(a).mul(b).toString() as Intl.StringNumericLiteral
}

function div(a: CurrencyAmount, b: CurrencyAmount) {
  return new Decimal(a).div(b).toString() as Intl.StringNumericLiteral
}

function gte(a: CurrencyAmount, b: CurrencyAmount) {
  return new Decimal(a).gte(b)
}

export { add, div, gte, mul, sub }
