import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod/v4'

import { TransactionTable } from '~/server/db/schema'

const CreateTransactionSchema = createInsertSchema(TransactionTable)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
  })
  .check((ctx) => {
    console.log('VALIDATING')
    if (
      ctx.value.type === 'TRANSFER' &&
      (ctx.value.fromBankAccountId == null || ctx.value.toBankAccountId == null)
    ) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        message:
          'From and to bank accounts are required for transfer transactions',
        path: ['fromBankAccountId', 'toBankAccountId'],
      })
    }

    if (
      ctx.value.type !== 'TRANSFER' &&
      (ctx.value.fromBankAccountId != null || ctx.value.toBankAccountId != null)
    ) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        message:
          'From and to bank accounts are not allowed for non expense/income transactions',
        path: ['fromBankAccountId', 'toBankAccountId'],
      })
    }
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
    amount: CreateTransactionSchema.shape.amount.nonempty(),
  })
  .required()

const ParseOFXInputSchema = z.object({
  bankAccountId: z.string(),
  groupId: z.string().optional(),
  files: z
    .array(z.instanceof(File))
    .nonempty()
    .refine(
      (files) => files.every((file) => /.*\.(qfx|ofx)$/.test(file.name)),
      {
        error: 'Files should be of format .ofx or .qfx.',
        path: ['files'],
      },
    ),
  shouldAutoCategorize: z.boolean(),
})
const UploadOFXFormSchema = ParseOFXInputSchema.pick({
  bankAccountId: true,
  files: true,
  shouldAutoCategorize: true,
})

const CreateManyTransactionsInputSchema = z
  .array(CreateTransactionSchema)
  .nonempty()

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
