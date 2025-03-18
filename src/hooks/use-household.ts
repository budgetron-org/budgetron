import { HouseholdContext } from '@/components/context/household-provider'
import { assertContextExists } from '@/lib/utils'
import { useContext } from 'react'

export function useHousehold() {
  const value = useContext(HouseholdContext)
  assertContextExists(
    value,
    'No HouseholdContext found. The useHousehold should only be used inside a HouseholdProvider',
  )
  return value
}
