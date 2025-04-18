import type {
  AccountType,
  Balance,
  StatementTransaction,
  Status,
} from './common'

export interface BankResponse {
  STMTTRNRS: StatementTransactionResponse
  [key: string]: unknown
}

export interface StatementTransactionResponse {
  TRNUID: string
  STATUS: Status
  STMTRS: StatementResponse
  [key: string]: unknown
}

export interface StatementResponse {
  CURDEF: string
  BANKACCTFROM: BankAccount
  BANKTRANLIST: BankTransactionList
  LEDGERBAL: Balance
  AVAILBAL?: Balance
  [key: string]: unknown
}

export type BankAccount = {
  BANKID: string
  ACCTID: string
  ACCTTYPE: AccountType
  [key: string]: unknown
}

export type BankTransactionList = {
  DTSTART: string
  DTEND: string
  STMTTRN: StatementTransaction[]
  STRTTRN: StatementTransaction[]
  [key: string]: unknown
}
