import { useEffect, useState } from 'react'
export type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
export function useFetch<T>(url: string | null): RemoteData<T> {
  const [state, setState] = useState<RemoteData<T>>({ status: 'idle' })
  useEffect(() => {
    if (url === null) {
      setState({ status: 'idle' })
      return
    }
    const controller = new AbortController()
    setState({ status: 'loading' })
    fetch(url, {
      signal: controller.signal,
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return (await r.json()) as T
      })
      .then((data) => setState({ status: 'success', data }))
      .catch((e) => {
        if ((e as Error).name !== 'AbortError')
          setState({ status: 'error', error: (e as Error).message })
      })
    return () => controller.abort()
  }, [url])
  return state
}
