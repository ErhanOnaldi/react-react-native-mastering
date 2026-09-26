import { useCallback, useState } from 'react'

export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial)
  // Bu fonksiyonlar başkalarının effect bağımlılığına girebilir: referansları sabit kalsın.
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((value) => !value), [])
  return { isOpen, open, close, toggle }
}
