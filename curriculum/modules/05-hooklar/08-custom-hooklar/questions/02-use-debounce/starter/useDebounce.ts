import { useState } from 'react'
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced] = useState(value)
  return debounced
}
