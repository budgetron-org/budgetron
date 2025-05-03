import { and, eq } from 'drizzle-orm'
import { db } from '~/server/db'
import { BankAccountTable } from '~/server/db/schema'

async function findAllBankAccounts({ userId }: { userId: string }) {
  return db.query.BankAccountTable.findMany({
    where: (t, { eq }) => eq(t.userId, userId),
  })
}

async function insertBankAccount(data: typeof BankAccountTable.$inferInsert) {
  const [bankAccount] = await db
    .insert(BankAccountTable)
    .values(data)
    .onConflictDoUpdate({
      target: [
        BankAccountTable.userId,
        BankAccountTable.name,
        BankAccountTable.type,
      ],
      set: data,
    })
    .returning()
  if (bankAccount == null) throw new Error('Error creating new bank account')
  return bankAccount
}

async function deleteBankAccount(
  data: Pick<typeof BankAccountTable.$inferSelect, 'id' | 'userId'>,
) {
  const [deleted] = await db
    .delete(BankAccountTable)
    .where(
      and(
        eq(BankAccountTable.id, data.id),
        eq(BankAccountTable.userId, data.userId),
      ),
    )
    .returning()
  if (deleted == null) throw new Error('Error deleting bank account')
  return deleted
}

async function updateBankAccount(
  data: Partial<Omit<typeof BankAccountTable.$inferInsert, 'id' | 'userId'>> &
    Pick<typeof BankAccountTable.$inferSelect, 'id' | 'userId'>,
) {
  const [bankAccount] = await db
    .update(BankAccountTable)
    .set({
      balance: data.balance,
      name: data.name,
      type: data.type,
    })
    .where(
      and(
        eq(BankAccountTable.id, data.id),
        eq(BankAccountTable.userId, data.userId),
      ),
    )
    .returning()
  if (bankAccount == null) throw new Error('Error creating new bank account')
  return bankAccount
}

export {
  deleteBankAccount,
  findAllBankAccounts,
  insertBankAccount,
  updateBankAccount,
}
