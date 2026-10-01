import { useEffect, useState } from 'react'
type State = 'loading' | 'error' | string
export function MovieStatus({ id }: { id: number }) {
  const [state, setState] = useState<State>('loading')
  useEffect(() => {
    let active = true
    setState('loading')
    fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: { Authorization: 'Bearer test-token' },
    })
      .then((response) => response.json() as Promise<{ title: string }>)
      .then((movie) => {
        if (active) setState(movie.title ?? 'loading')
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [id])
  if (state === 'loading') return <p role="status">Yükleniyor</p>
  if (state === 'error') return <p role="alert">Film yüklenemedi</p>
  return <h2>{state}</h2>
}
