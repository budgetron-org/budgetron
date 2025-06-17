import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'

import { BankAccountTable } from '~/server/db/schema'

const CreateBankAccountSchema = createInsertSchema(BankAccountTable)
const CreateBankAccountInputSchema = CreateBankAccountSchema.omit({
  userId: true,
})
const BankAccountFormSchema = CreateBankAccountSchema.pick({
  name: true,
  type: true,
  balance: true,
})

const UpdateBankAccountSchema = createUpdateSchema(BankAccountTable)
const UpdateBankAccountInputSchema = UpdateBankAccountSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
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
