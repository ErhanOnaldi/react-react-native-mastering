import { useEffect, useState } from 'react'

type State = { status: 'loading' | 'error' | 'success'; title: string }
export function MovieDetail({ id }: { id: number }) {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<State>({ status: 'loading', title: '' })
  useEffect(() => {
    let active = true
    setState({ status: 'loading', title: '' })
    fetch(`https://api.themoviedb.org/3/movie/${id}?language=tr-TR`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Detay yüklenemedi')
        return response.json() as Promise<{ title: string }>
      })
      .then((movie) => {
        if (active) setState({ status: 'success', title: movie.title })
      })
      .catch(() => {
        if (active) setState({ status: 'error', title: '' })
      })
    return () => {
      active = false
    }
  }, [id, attempt])
  return (
    <section>
      {state.status === 'loading' && <p>Yükleniyor</p>}
      {state.status === 'error' && (
        <>
          <p role="alert">Detay yüklenemedi</p>
          <button onClick={() => setAttempt((value) => value + 1)}>Yeniden dene</button>
        </>
      )}
      {state.status === 'success' && <h2>{state.title}</h2>}
    </section>
  )
}
