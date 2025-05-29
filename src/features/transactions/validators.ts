import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
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
  .extend({
    amount: CreateTransactionSchema.shape.amount.min(0),
  })
  .required()

const ParseOFXInputSchema = z.object({
  bankAccountId: z.string(),
  groupId: z.string().optional(),
  files: z
    .instanceof(File)
    .array()
    .min(1)
    .refine(
      (files) => files.every((file) => /.*\.(qfx|ofx)$/.test(file.name)),
      'Files should be of format .ofx or .qfx.',
    ),
  shouldAutoCategorize: z.boolean(),
})
const UploadOFXFormSchema = ParseOFXInputSchema.pick({
  bankAccountId: true,
  files: true,
  shouldAutoCategorize: true,
})

const CreateManyTransactionsInputSchema = CreateTransactionSchema.omit({
  createdAt: true,
  id: true,
  updatedAt: true,
  userId: true,
})
  .array()
  .min(1)

const GetByDateRangeInputSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
})

const GetByCategoryInputSchema = z.object({
  categoryId: z.string(),
  from: z.coerce.date(),
  to: z.coerce.date(),
})

const UpdateTransactionSchema = createUpdateSchema(TransactionTable)
const UpdateTransactionInputSchema = UpdateTransactionSchema.omit({
  id: true,
  userId: true,
}).extend({
  id: UpdateTransactionSchema.required().shape.id,
})

const DeleteTransactionInputSchema = UpdateTransactionSchema.pick({
  id: true,
}).required()

export {
  AddTransactionInputSchema,
  CreateManyTransactionsInputSchema,
  CreateTransactionSchema,
  DeleteTransactionInputSchema,
  GetByCategoryInputSchema,
  GetByDateRangeInputSchema,
  ParseOFXInputSchema,
  TransactionFormSchema,
  UpdateTransactionInputSchema,
  UploadOFXFormSchema,
}
