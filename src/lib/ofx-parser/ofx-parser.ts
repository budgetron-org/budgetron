import { unescape } from 'lodash'

import type { BankAccountTable, HouseholdTable } from '~/db/schema'
import { getCurrencyFormatter } from '../format'
import { safeParseCurrency } from '../utils'
import { Ofx, Types, type StatementTransaction } from './ofx-utils'

export async function parseTransactions(
  file: File,
  account: typeof BankAccountTable.$inferSelect,
  household: typeof HouseholdTable.$inferSelect | null = null,
) {
  const ofx = Ofx.fromBuffer(Buffer.from(await file.arrayBuffer()))

  const content = ofx.getContent()
  const type = ofx.getType()
  const transactions =
    type === Types.BANK
      ? ofx.getBankTransferList()
      : ofx.getCreditCardTransferList()
  const currency = safeParseCurrency(
    type === Types.BANK
      ? content.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.CURDEF
      : content.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS.CURDEF,
  )
  const currencyFormatter = getCurrencyFormatter(currency)

  return transactions.map((t) => {
    const isExpense = t.TRNAMT < 0
    return {
      account,
      household,
      amount: t.TRNAMT.toString(),
      formattedAmount: currencyFormatter.format(t.TRNAMT),
      currency,
      date: new Date(t.DTPOSTED),
      description: getDescription(t, isExpense),
      type: isExpense ? ('expense' as const) : ('income' as const),
      externalId: `${account.id}-${t.FITID}`,
      category: null,
    }
  })
}

function getDescription(txn: StatementTransaction, isExpense: boolean) {
  // clean any HTML parts
  return unescape(
    txn['NAME'] ?? txn.MEMO ?? `Unknown ${isExpense ? 'expense' : 'income'}`,
  )
}
