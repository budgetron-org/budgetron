import { Prisma } from '@prisma/client'
import { unescape } from 'lodash'

import type { Account, Household } from '@/prisma/schemas'
import type { TransactionRecord } from '@/schemas/transaction'
import { getCurrencyFormatter } from './format'
import { Ofx, Types, type StatementTransaction } from './ofx-utils'
import { safeParseCurrency } from './utils'

export async function parseTransactions(
  file: File,
  account: Account,
  household?: Nullable<Household>,
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

  return transactions.map<TransactionRecord>((t) => {
    const txnAmount = new Prisma.Decimal(t.TRNAMT)
    const isExpense = txnAmount.isNegative()
    return {
      account,
      household,
      amount: txnAmount.absoluteValue().toString(),
      formattedAmount: currencyFormatter.format(
        txnAmount.absoluteValue().toNumber(),
      ),
      currency,
      date: new Date(t.DTPOSTED),
      description: getDescription(t, isExpense),
      type: isExpense ? 'expense' : 'income',
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
