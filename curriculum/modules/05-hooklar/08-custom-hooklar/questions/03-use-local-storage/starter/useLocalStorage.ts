import { useState } from 'react'
export type ValueUpdater<T> = (value: T | ((current: T) => T)) => void
export function useLocalStorage<T>(key: string, initial: T): [T, ValueUpdater<T>] {
  const [value, setValue] = useState(initial)
  return [value, () => {}]
}
