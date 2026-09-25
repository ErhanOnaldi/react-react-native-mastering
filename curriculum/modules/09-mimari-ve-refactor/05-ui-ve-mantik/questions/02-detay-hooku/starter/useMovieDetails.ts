import { useState } from 'react'

export type Movie = { id: number; title: string }
export type MovieState =
  { status: 'loading' } | { status: 'success'; movie: Movie } | { status: 'error'; message: string }

export function useMovieDetails(
  id: number,
  load: (id: number, signal: AbortSignal) => Promise<Movie>,
): MovieState {
  const [state] = useState<MovieState>({ status: 'loading' })
  return state
}
