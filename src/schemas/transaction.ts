import {
  TransactionOptionalDefaultsSchema,
  type Account,
  type Category,
  type Household,
  type Transaction,
} from '@/prisma/schemas'
import { z } from 'zod'

// #region Create Transaction
/**
 * ================================
 * Create Transactions
 * ================================
 */
export const CreateTransactionSchema = TransactionOptionalDefaultsSchema.pick({
  accountId: true,
  amount: true,
  categoryId: true,
  currency: true,
  date: true,
  description: true,
  externalId: true,
  householdId: true,
  type: true,
  userId: true,
}).extend({
  // We can convert string -> Decimal in the server before inserting
  amount: z.string().refine((value) => !isNaN(parseInt(value))),
})

export const CreateTransactionSchemaWithoutUser = CreateTransactionSchema.omit({
  userId: true,
})
// #endregion Create Transaction

// #region Parse Transactions
/**
 * ================================
 * Parse OFX Transactions
 * ================================
 */
export const ParseOFXSchema = z.object({
  accountId: z.string(),
  householdId: z.string().optional(),
  file: z
    .instanceof(File)
    .refine(
      (file) => /.*\.(qfx|ofx)$/.test(file.name),
      'Please provide an OFX file.',
    ),
})
// #endregion Parse Transactions

// #region Get Transactions
/**
 * ================================
 * Get Transactions
 * ================================
 */
export const GetTransactionsSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
})
// #endregion Get Transactions

export type TransactionRecord = Pick<
  Transaction,
  'currency' | 'date' | 'description' | 'type' | 'externalId'
> & {
  account: Nullable<Account>
  amount: string
  category: Nullable<Pick<Category, 'icon' | 'id' | 'name'>>
  household: Nullable<Pick<Household, 'icon' | 'id' | 'name'>>
}
