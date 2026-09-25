import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
export function useLocalStorage<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState(initial)
  return [value, setValue]
}
