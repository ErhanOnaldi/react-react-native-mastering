import { useCallback, useEffect, useRef, useState } from 'react'
import { useSaveFile } from './api'

export type SaveStatus = 'saved' | 'saving' | 'error'

/** Editör değişikliklerini dosya başına ~500 ms gecikmeyle diske yazar. */
export function useAutosave(code: string, onSaved?: () => void) {
  const { mutateAsync } = useSaveFile(code)
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>())
  const pending = useRef(new Map<string, string>())
  const [status, setStatus] = useState<SaveStatus>('saved')
  const onSavedRef = useRef(onSaved)
  useEffect(() => {
    onSavedRef.current = onSaved
  }, [onSaved])

  const flushOne = useCallback(
    async (name: string) => {
      const content = pending.current.get(name)
      if (content === undefined) return
      pending.current.delete(name)
      setStatus('saving')
      try {
        await mutateAsync({ name, content })
        if (pending.current.size === 0) {
          setStatus('saved')
          onSavedRef.current?.()
        }
      } catch {
        setStatus('error')
      }
    },
    [mutateAsync],
  )

  const schedule = useCallback(
    (name: string, content: string) => {
      pending.current.set(name, content)
      clearTimeout(timers.current.get(name))
      timers.current.set(
        name,
        setTimeout(() => void flushOne(name), 500),
      )
      setStatus('saving')
    },
    [flushOne],
  )

  /** Bekleyen tüm kayıtları hemen yazar (örn. "Çalıştır"dan önce). */
  const flush = useCallback(async () => {
    for (const timer of timers.current.values()) clearTimeout(timer)
    timers.current.clear()
    await Promise.all([...pending.current.keys()].map(flushOne))
  }, [flushOne])

  // Sayfadan ayrılırken bekleyen değişiklikleri kaybetme
  useEffect(() => {
    return () => {
      void flush()
    }
  }, [flush])

  return { schedule, flush, status }
}
