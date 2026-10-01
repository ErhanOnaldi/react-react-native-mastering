import { useEffect, useState } from 'react'

interface Movie {
  title: string
}

type State = { kind: 'loading' } | { kind: 'success'; title: string } | { kind: 'error' }

export function MovieTitle({ id }: { id: number }) {
  const [state, setState] = useState<State>({ kind: 'loading' })
  useEffect(() => {
    let active = true
    setState({ kind: 'loading' })
    fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: { Authorization: 'Bearer test-token' },
    })
      .then((response) => {
        if (!response.ok) throw new Error('HTTP')
        return response.json() as Promise<Movie>
      })
      .then((movie) => {
        if (active) setState({ kind: 'success', title: movie.title })
      })
      .catch(() => {
        if (active) setState({ kind: 'error' })
      })
    return () => {
      active = false
    }
  }, [id])
  if (state.kind === 'loading') return null
  if (state.kind === 'error') return <p role="alert">Film yüklenemedi</p>
  return <h2>{state.title}</h2>
}
