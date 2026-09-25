import { useState } from 'react'
export type SearchState = {
  status: 'idle' | 'loading' | 'success' | 'error'
  titles: string[]
  error: string | null
}
export function useMovieSearch(query: string, wait = 200): SearchState {
  const [state] = useState<SearchState>({ status: 'idle', titles: [], error: null })
  return state
}
