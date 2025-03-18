import { useCallback, useState } from 'react'

export function useValue<T>(value: T, onChange?: (value: T) => void) {
  const [state, _setState] = useState(value)
  const setState = useCallback<typeof _setState>(
    (stateOrStateFn) => {
      if (typeof stateOrStateFn === 'function') {
        _setState((prevState) => {
          const nextState = (stateOrStateFn as (s: T) => T)(prevState)
          onChange?.(nextState)
          return nextState
        })
        return
      }
      _setState(stateOrStateFn)
      onChange?.(stateOrStateFn)
    },
    [onChange],
  )

  return [state, setState] as const
}
