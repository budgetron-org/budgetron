import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod/v4'

import { CURRENCY_CODES } from '~/data/currencies'

import { BankAccountTable } from '~/server/db/schema'

const CreateBankAccountSchema = createInsertSchema(BankAccountTable).extend({
  currency: z.enum(CURRENCY_CODES),
})
const CreateBankAccountInputSchema = CreateBankAccountSchema.omit({
  userId: true,
})
const BankAccountFormSchema = CreateBankAccountSchema.pick({
  name: true,
  type: true,
  balance: true,
  currency: true,
})

const UpdateBankAccountSchema = createUpdateSchema(BankAccountTable)
const UpdateBankAccountInputSchema = UpdateBankAccountSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  currency: true,
}).extend({
  id: UpdateBankAccountSchema.required().shape.id,
})

const DeleteBankAccountInputSchema = UpdateBankAccountSchema.pick({
  id: true,
}).required()

export {
  BankAccountFormSchema,
  CreateBankAccountInputSchema,
  DeleteBankAccountInputSchema,
  UpdateBankAccountInputSchema,
}
