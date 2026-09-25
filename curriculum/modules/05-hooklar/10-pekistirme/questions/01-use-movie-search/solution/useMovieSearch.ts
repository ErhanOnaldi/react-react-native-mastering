import { useEffect, useReducer, useState } from 'react'
export type SearchState = {
  status: 'idle' | 'loading' | 'success' | 'error'
  titles: string[]
  error: string | null
}
type Action =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; titles: string[] }
  | { type: 'error'; message: string }
const idle: SearchState = { status: 'idle', titles: [], error: null }
function reducer(_state: SearchState, action: Action): SearchState {
  switch (action.type) {
    case 'idle':
      return idle
    case 'loading':
      return { status: 'loading', titles: [], error: null }
    case 'success':
      return { status: 'success', titles: action.titles, error: null }
    case 'error':
      return { status: 'error', titles: [], error: action.message }
  }
}
export function useMovieSearch(query: string, wait = 200): SearchState {
  const [debounced, setDebounced] = useState(query)
  const [state, dispatch] = useReducer(reducer, idle)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), wait)
    return () => clearTimeout(timer)
  }, [query, wait])
  useEffect(() => {
    if (!query.trim()) {
      dispatch({ type: 'idle' })
      return
    }
    if (debounced !== query) return
    const controller = new AbortController()
    dispatch({ type: 'loading' })
    const url = new URL('https://api.themoviedb.org/3/search/movie')
    url.searchParams.set('query', debounced)
    fetch(url, {
      signal: controller.signal,
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return (await r.json()) as { results: { title: string }[] }
      })
      .then((d) => dispatch({ type: 'success', titles: d.results.map((m) => m.title) }))
      .catch((e) => {
        if ((e as Error).name !== 'AbortError')
          dispatch({ type: 'error', message: (e as Error).message })
      })
    return () => controller.abort()
  }, [debounced, query])
  return state
}
