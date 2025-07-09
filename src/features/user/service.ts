import { eq } from 'drizzle-orm'

import type { CurrencyCode } from '~/data/currencies'
import { db } from '~/server/db'
import { UserSettingsTable } from '~/server/db/schema'

type GetUserSettingsParams = {
  userId: string
}
async function getUserSettings({ userId }: GetUserSettingsParams) {
  const [result] = await db
    .select()
    .from(UserSettingsTable)
    .where(eq(UserSettingsTable.userId, userId))
    .limit(1)
  if (result == null) {
    // make sure to create a default user settings if one does not exist
    const defaultResult = await setUserDefaultCurrency({
      currency: 'USD',
      userId,
    })
    return defaultResult
  }
  return result
}

type SetUserDefaultCurrencyParams = {
  currency: CurrencyCode
  userId: string
}
async function setUserDefaultCurrency({
  currency,
  userId,
}: SetUserDefaultCurrencyParams) {
  const [result] = await db
    .insert(UserSettingsTable)
    .values({ currency, userId })
    .onConflictDoUpdate({
      target: UserSettingsTable.userId,
      set: { currency },
    })
    .returning()
  if (result == null) throw new Error('Error setting default currency')
  return result
}

export { getUserSettings, setUserDefaultCurrency }
