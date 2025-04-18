export type SignOnResponse = {
  SONRS: SignOnStatus
  [key: string]: unknown
}

export type SignOnStatus = {
  STATUS: Status
  DTSERVER: string
  LANGUAGE: string
  FI?: FinancialInstitution
  [key: string]: unknown
}

export type Status = {
  CODE: number | string
  SEVERITY: 'INFO' | 'WARN' | 'ERROR'
  MESSAGE?: string
  [key: string]: unknown
}

export type FinancialInstitution = {
  ORG: string
  FID: string
  [key: string]: unknown
}
