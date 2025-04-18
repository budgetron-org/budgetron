import {
  type ExtractorConfig,
  type MetaData,
  type TransactionsSummary,
  Types,
} from '../types/common'
import type { StatementTransaction } from '../types/ofx/common'
import type { OfxResponse, OfxStructure } from '../types/ofx/index'

export interface IExtractor {
  getType(): Types

  config(config: ExtractorConfig): this

  getHeaders(): MetaData

  getBankTransferList(): StatementTransaction[]

  getCreditCardTransferList(): StatementTransaction[]

  getTransactionsSummary(): TransactionsSummary

  getContent(): OfxStructure

  toJson(): OfxResponse
}
