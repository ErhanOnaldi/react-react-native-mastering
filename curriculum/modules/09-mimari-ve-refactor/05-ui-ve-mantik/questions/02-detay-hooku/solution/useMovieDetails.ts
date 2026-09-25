import { useEffect, useState } from 'react'

export type Movie = { id: number; title: string }
export type MovieState =
  { status: 'loading' } | { status: 'success'; movie: Movie } | { status: 'error'; message: string }

export function useMovieDetails(
  id: number,
  load: (id: number, signal: AbortSignal) => Promise<Movie>,
): MovieState {
  const [state, setState] = useState<MovieState>({ status: 'loading' })
  useEffect(() => {
    const controller = new AbortController()
    let active = true
    setState({ status: 'loading' })
    load(id, controller.signal).then(
      (movie) => {
        if (active) setState({ status: 'success', movie })
      },
      (error: unknown) => {
        if (active)
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Film yüklenemedi',
          })
      },
    )
    return () => {
      active = false
      controller.abort()
    }
  }, [id, load])
  return state
}
