import type { BankAccountTable } from '~/server/db/schema'

export type BankAccount = typeof BankAccountTable.$inferSelect
