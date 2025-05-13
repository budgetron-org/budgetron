import { Types } from '../types/common'
import type { StatementTransaction } from '../types/ofx/common'
import { BANK_SERVICE_START } from './constants'

const debitTypes = [
  'debit',
  'fee',
  'srvchg',
  'atm',
  'pos',
  'check',
  'payment',
  'directdebit',
  'cash',
  'repeatpmt',
]

const extractType = (content: string) => {
  if (content.includes(BANK_SERVICE_START)) {
    return Types.BANK
  }
  return Types.CREDIT_CARD
}

function isDebt(transaction: StatementTransaction) {
  if (String(transaction.TRNAMT).startsWith('-')) return true
  const type = String(transaction.TRNTYPE).toLocaleLowerCase()
  return type === '1' || debitTypes.includes(type)
}

export { extractType, isDebt }
