import { Config } from '../common/config'
import {
  fixJsonProblems,
  getBankStatementTransactionsText,
  getCreditCardStatementTransactionsText,
  getTransactionsSummary,
} from '../common/parse'
import { CustomExtractor } from '../interfaces/custom-extractor.interface'
import type { TransactionsSummary } from '../types/common'
import type { OfxStructure } from '../types/ofx/index'

export class OfxExtractor extends CustomExtractor {
  setConfig(config: Config) {
    this.configInstance = config
  }

  getBankTransferList(data: string) {
    const { newBankStatementTransactions } = getBankStatementTransactionsText(
      this.configInstance.getPartialJsonData(data),
    )
    if (!newBankStatementTransactions) return []
    return (
      JSON.parse(
        `{${fixJsonProblems(newBankStatementTransactions)}}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as Record<string, any>
    )?.BANKMSGSRSV1?.STMTTRNRS?.STMTRS?.BANKTRANLIST?.STRTTRN
  }

  getCreditCardTransferList(data: string) {
    const { newCreditCardStatementTransactions } =
      getCreditCardStatementTransactionsText(
        this.configInstance.getPartialJsonData(data),
      )
    if (!newCreditCardStatementTransactions) return []
    return (
      JSON.parse(
        `{${fixJsonProblems(newCreditCardStatementTransactions)}}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as Record<string, any>
    )?.CREDITCARDMSGSRSV1?.CCSTMTTRNRS?.CCSTMTRS?.BANKTRANLIST?.STRTTRN
  }

  getTransactionsSummary(data: string) {
    const jsonData = this.getContent(data)
    const { DTEND, DTSTART, ...restData } =
      jsonData.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST
    const summary = getTransactionsSummary(restData.STMTTRN || restData.STRTTRN)
    return {
      dateStart: DTSTART,
      dateEnd: DTEND,
      ...summary,
    } as unknown as TransactionsSummary
  }

  getContent(data: string): OfxStructure {
    const ofxText = this.configInstance.getPartialJsonData(data)
    const { newBankStatementTransactions, oldBankStatementTransactions } =
      getBankStatementTransactionsText(ofxText)
    const {
      newCreditCardStatementTransactions,
      oldCreditCardStatementTransactions,
    } = getCreditCardStatementTransactionsText(ofxText)
    let result = ofxText
    if (newBankStatementTransactions) {
      result = result.replace(
        oldBankStatementTransactions,
        newBankStatementTransactions,
      )
    }
    if (newCreditCardStatementTransactions) {
      result = result.replace(
        oldCreditCardStatementTransactions,
        newCreditCardStatementTransactions,
      )
    }
    return JSON.parse(`{${fixJsonProblems(result)}}`) as OfxStructure
  }
}
