import { useEffect, useState } from 'react'
export type ValueUpdater<T> = (value: T | ((current: T) => T)) => void
export function useLocalStorage<T>(key: string, initial: T): [T, ValueUpdater<T>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved === null ? initial : (JSON.parse(saved) as T)
    } catch {
      return initial
    }
  })
  function updateValue(nextValue: T | ((current: T) => T)) {
    setValue((current) =>
      typeof nextValue === 'function' ? (nextValue as (current: T) => T)(current) : nextValue,
    )
  }
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, updateValue]
}
