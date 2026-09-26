import { useState } from 'react'

export function useDisclosure(initial = false) {
  const [isOpen] = useState(initial)
  return { isOpen, open: () => {}, close: () => {}, toggle: () => {} }
}
