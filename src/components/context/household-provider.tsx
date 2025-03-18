import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const CURRENT_HOUSEHOLD_LOCAL_STORAGE_KEY = 'budgetifyCurrentHouseholdId'

type HouseholdContextValue = {
  currentHouseholdId?: string
  setCurrentHousehold: (id: string | undefined) => void
}
export const HouseholdContext = createContext<HouseholdContextValue | null>(
  null,
)

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const [currentHouseholdId, _setCurrentHousehold] = useState<string>()
  const setCurrentHousehold = useCallback<
    HouseholdContextValue['setCurrentHousehold']
  >((id) => {
    _setCurrentHousehold(id)
    localStorage.setItem(CURRENT_HOUSEHOLD_LOCAL_STORAGE_KEY, '')
  }, [])

  const value = useMemo<HouseholdContextValue>(
    () => ({ currentHouseholdId, setCurrentHousehold }),
    [currentHouseholdId, setCurrentHousehold],
  )

  // load current selected household from localStorage
  useEffect(() => {
    const id = localStorage.getItem(CURRENT_HOUSEHOLD_LOCAL_STORAGE_KEY)
    if (id) _setCurrentHousehold(id)
    else _setCurrentHousehold(undefined)
  }, [])

  return (
    <HouseholdContext.Provider value={value}>
      {children}
    </HouseholdContext.Provider>
  )
}
