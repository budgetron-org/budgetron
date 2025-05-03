import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const CURRENT_GROUP_LOCAL_STORAGE_KEY = 'budgetifyCurrentGroupId'

type GroupContextValue = {
  currentGroupId?: string
  setCurrentGroup: (id: string | undefined) => void
}
export const GroupContext = createContext<GroupContextValue | null>(null)

export function GroupProvider({ children }: { children: ReactNode }) {
  const [currentGroupId, _setCurrentGroup] = useState<string>()
  const setCurrentGroup = useCallback<GroupContextValue['setCurrentGroup']>(
    (id) => {
      _setCurrentGroup(id)
      localStorage.setItem(CURRENT_GROUP_LOCAL_STORAGE_KEY, '')
    },
    [],
  )

  const value = useMemo<GroupContextValue>(
    () => ({ currentGroupId, setCurrentGroup }),
    [currentGroupId, setCurrentGroup],
  )

  // load current selected group from localStorage
  useEffect(() => {
    const id = localStorage.getItem(CURRENT_GROUP_LOCAL_STORAGE_KEY)
    if (id) _setCurrentGroup(id)
    else _setCurrentGroup(undefined)
  }, [])

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
}
