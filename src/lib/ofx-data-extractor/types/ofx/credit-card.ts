import type { BankTransactionList } from './banking'
import type { Balance, Status } from './common'

export type CreditCardTransactionResponse = {
  TRNUID: string
  STATUS: Status
  CCSTMTRS: CreditCardStatementResponse
  [key: string]: unknown
}

export type CreditCardStatementResponse = {
  CURDEF: string
  CCACCTFROM: CreditCardAccount
  BANKTRANLIST: BankTransactionList
  LEDGERBAL: Balance
  AVAILBAL?: Balance
  [key: string]: unknown
}

export type CreditCardAccount = {
  ACCTID: string
  [key: string]: unknown
}

export type CreditCardResponse = {
  CCSTMTTRNRS: CreditCardTransactionResponse
  [key: string]: unknown
}
