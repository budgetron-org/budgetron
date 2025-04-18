import { getGlobalTag, getIdTag } from '~/lib/cache'
import { revalidateTag } from 'next/cache'

export function getGlobalBudgetTag() {
  return getGlobalTag('budgets')
}

export function getUserBudgetTag(userId: string) {
  return getIdTag('budgets', userId)
}

export function revalidateBudgetCache(userId?: string) {
  revalidateTag(getGlobalBudgetTag())
  if (userId) revalidateTag(getUserBudgetTag(userId))
}
