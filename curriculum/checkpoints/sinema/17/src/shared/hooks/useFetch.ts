import { useEffect, useState } from 'react'
import type { RemoteData } from '@/shared/lib/remote-data'

export function useFetch<T>(url: string | null): RemoteData<T> {
  const [state, setState] = useState<RemoteData<T>>({ status: 'idle' })

  useEffect(() => {
    const controller = new AbortController()
    if (url === null) {
      queueMicrotask(() => {
        if (!controller.signal.aborted) setState({ status: 'idle' })
      })
      return () => controller.abort()
    }
    queueMicrotask(() => {
      if (!controller.signal.aborted) setState({ status: 'loading' })
    })

    async function load() {
      try {
        const response = await fetch(url!, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
          },
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = (await response.json()) as T
        if (!controller.signal.aborted) setState({ status: 'success', data })
      } catch (error) {
        if (!controller.signal.aborted) {
          setState({
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
          })
        }
      }
    }

    void load()
    return () => controller.abort()
  }, [url])

  return state
}
