import { useCallback, useEffect, useRef, useState } from 'react'
import { useSaveFile } from './api'

export type SaveStatus = 'saved' | 'saving' | 'error'

// Soru başına bekleyen kayıtlar: soru yeniden açılırken önce bunların bitmesi beklenir,
// böylece sunucudan eski içerik okunup editöre yüklenmez.
const pendingByQuestion = new Map<string, Set<Promise<unknown>>>()

export async function waitForPendingSaves(code: string) {
  const pending = pendingByQuestion.get(code)
  if (pending?.size) await Promise.allSettled([...pending])
}

function track(code: string, promise: Promise<unknown>) {
  const set = pendingByQuestion.get(code) ?? new Set()
  set.add(promise)
  pendingByQuestion.set(code, set)
  void promise.finally(() => set.delete(promise)).catch(() => undefined)
}

interface FileState {
  timer?: ReturnType<typeof setTimeout>
  /** Henüz yazılmamış en son içerik */
  dirty?: string
  /** Bu dosyanın yazım zinciri: yazımlar sırayla gider, üst üste binmez */
  chain: Promise<void>
}

/**
 * Editör değişikliklerini dosya başına ~500 ms gecikmeyle diske yazar.
 * - Aynı dosyanın yazımları sıralıdır (eski içerik yenisinin üstüne yazamaz).
 * - `flush` tüm yazımlar gerçekten bitene kadar bekler; bir yazım başarısızsa reddeder
 *   ve içerik "kirli" kalır (bir sonraki denemede tekrar yazılır).
 */
export function useAutosave(code: string, onSaved?: () => void) {
  const { mutateAsync } = useSaveFile(code)
  const files = useRef(new Map<string, FileState>())
  const [status, setStatus] = useState<SaveStatus>('saved')
  const onSavedRef = useRef(onSaved)
  useEffect(() => {
    onSavedRef.current = onSaved
  }, [onSaved])

  const stateOf = (name: string) => {
    let state = files.current.get(name)
    if (!state) {
      state = { chain: Promise.resolve() }
      files.current.set(name, state)
    }
    return state
  }

  const refreshStatus = useCallback(() => {
    const anyDirty = [...files.current.values()].some((f) => f.dirty !== undefined)
    setStatus((prev) => (prev === 'error' && anyDirty ? 'error' : anyDirty ? 'saving' : 'saved'))
  }, [])

  const writeNow = useCallback(
    (name: string) => {
      const state = stateOf(name)
      clearTimeout(state.timer)
      const op = state.chain
        .catch(() => undefined)
        .then(async () => {
          const content = state.dirty
          if (content === undefined) return
          state.dirty = undefined
          try {
            await mutateAsync({ name, content })
          } catch (error) {
            // Başarısız yazım kaybolmasın: daha yeni bir değişiklik yoksa tekrar kirli işaretle
            if (state.dirty === undefined) state.dirty = content
            setStatus('error')
            throw error
          }
        })
      state.chain = op
      track(code, op)
      void op
        .then(() => {
          refreshStatus()
          if ([...files.current.values()].every((f) => f.dirty === undefined))
            onSavedRef.current?.()
        })
        .catch(() => undefined)
      return op
    },
    [code, mutateAsync, refreshStatus],
  )

  const schedule = useCallback(
    (name: string, content: string) => {
      const state = stateOf(name)
      state.dirty = content
      clearTimeout(state.timer)
      state.timer = setTimeout(() => void writeNow(name).catch(() => undefined), 500)
      setStatus((prev) => (prev === 'error' ? 'error' : 'saving'))
    },
    [writeNow],
  )

  /** Bekleyen tüm kayıtları yazar ve bitmelerini bekler; herhangi biri başarısızsa hata fırlatır. */
  const flush = useCallback(async () => {
    const ops = [...files.current.keys()].map((name) => writeNow(name))
    const results = await Promise.allSettled(ops)
    const failed = results.find((r) => r.status === 'rejected')
    if (failed) throw new Error('Değişikliklerin kaydedilemedi; testler çalıştırılmadı.')
    setStatus('saved')
  }, [writeNow])

  // Sayfadan ayrılırken bekleyen değişiklikleri kaybetme
  useEffect(() => {
    return () => {
      void flush().catch(() => undefined)
    }
  }, [flush])

  return { schedule, flush, status }
}
