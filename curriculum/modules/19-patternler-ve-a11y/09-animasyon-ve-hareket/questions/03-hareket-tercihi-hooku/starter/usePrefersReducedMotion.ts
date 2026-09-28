import { useState } from 'react'

export function usePrefersReducedMotion(): boolean {
  const [reduced] = useState(false)
  return reduced
}
