import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { TransactionTable } from '~/server/db/schema'

const CreateTransactionSchema = createInsertSchema(TransactionTable)
const AddTransactionInputSchema = CreateTransactionSchema.omit({
  userId: true,
})
const TransactionFormSchema = CreateTransactionSchema.pick({
  amount: true,
  bankAccountId: true,
  categoryId: true,
  currency: true,
  date: true,
  description: true,
  type: true,
})

const ParseOFXInputSchema = z.object({
  bankAccountId: z.string(),
  groupId: z.string().optional(),
  file: z
    .instanceof(File)
    .refine(
      (file) => /.*\.(qfx|ofx)$/.test(file.name),
      'Please provide an OFX file.',
    ),
})
const UploadOFXFormSchema = ParseOFXInputSchema.pick({
  bankAccountId: true,
  file: true,
})

const CreateManyTransactionsInputSchema = CreateTransactionSchema.omit({
  userId: true,
})
  .array()
  .min(1)

const GetByDateRangeInputSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
})

const GetMonthlySummaryInputSchema = GetByDateRangeInputSchema

const GetCategorySpendInputSchema = GetByDateRangeInputSchema.extend({
  limit: z.number().min(1),
})

export {
  AddTransactionInputSchema,
  CreateManyTransactionsInputSchema,
  CreateTransactionSchema,
  GetByDateRangeInputSchema,
  GetCategorySpendInputSchema,
  GetMonthlySummaryInputSchema,
  ParseOFXInputSchema,
  TransactionFormSchema,
  UploadOFXFormSchema,
}
