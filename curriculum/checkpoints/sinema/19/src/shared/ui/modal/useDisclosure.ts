import { useCallback, useState } from 'react'

/**
 * Görünümden bağımsız aç/kapat davranışı (headless hook).
 * Fonksiyonlar başka effect'lerin bağımlılığına girebileceği için referansları sabittir.
 */
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((value) => !value), [])
  return { isOpen, open, close, toggle }
}
