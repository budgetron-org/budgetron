import type { MetaData } from '../common'
import type { BankResponse } from './banking'
import type { CreditCardResponse } from './credit-card'
import type { SignOnResponse } from './signon'

export type OFX = {
  SIGNONMSGSRSV1: SignOnResponse
  BANKMSGSRSV1: BankResponse
  CREDITCARDMSGSRSV1: CreditCardResponse
  [key: string]: unknown
}

export type OfxStructure = {
  OFX: OFX
  [key: string]: unknown
}

export type OfxResponse = MetaData & OfxStructure
