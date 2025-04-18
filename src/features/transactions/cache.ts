import { getGlobalTag, getIdTag } from '~/lib/cache'
import { revalidateTag } from 'next/cache'

export function getGlobalTransactionTag() {
  return getGlobalTag('transactions')
}

export function getUserTransactionTag(userId: string) {
  return getIdTag('transactions', userId)
}

export function revalidateTransactionCache(id?: string) {
  revalidateTag(getGlobalTransactionTag())
  if (id != null) revalidateTag(getUserTransactionTag(id))
}
