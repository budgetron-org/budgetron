import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { TransactionTable } from '~/server/db/schema'

// #region Create Transaction
/**
 * ================================
 * Create Transactions
 * ================================
 */
export const CreateTransactionSchema = createInsertSchema(TransactionTable)
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
  bankAccountId: z.string(),
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
