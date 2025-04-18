import { Config } from '../common/config'
import type { TransactionsSummary } from '../types/common'

export abstract class CustomExtractor {
  configInstance: Config = {} as Config
  abstract setConfig(config: Config): void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract getBankTransferList(data: string): any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract getCreditCardTransferList(data: string): any
  abstract getTransactionsSummary(data: string): TransactionsSummary
  abstract getContent(data: string): object
}
