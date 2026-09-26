import { useEffect, useState } from 'react'

type Movie = { id: number; title: string }
type State = { status: 'loading' | 'success' | 'error'; movies: Movie[] }
function useMovies(path: string | null) {
  const [state, setState] = useState<State>({ status: 'loading', movies: [] })
  useEffect(() => {
    if (!path) {
      setState({ status: 'success', movies: [] })
      return
    }
    let active = true
    setState({ status: 'loading', movies: [] })
    fetch(`https://api.themoviedb.org/3${path}`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error()
        return response.json() as Promise<{ results: Movie[] }>
      })
      .then((data) => {
        if (active) setState({ status: 'success', movies: data.results })
      })
      .catch(() => {
        if (active) setState({ status: 'error', movies: [] })
      })
    return () => {
      active = false
    }
  }, [path])
  return state
}
function MovieList({ state }: { state: State }) {
  if (state.status === 'loading') return <p>Yükleniyor</p>
  if (state.status === 'error') return <p role="alert">Filmler yüklenemedi</p>
  if (!state.movies.length) return <p>Film bulunamadı</p>
  return (
    <ul>
      {state.movies.map((movie) => (
        <li key={movie.id}>{movie.title}</li>
      ))}
    </ul>
  )
}
function Popular() {
  return <MovieList state={useMovies('/movie/popular?language=tr-TR')} />
}
function Search() {
  const [query, setQuery] = useState('')
  const path = query.trim()
    ? `/search/movie?language=tr-TR&query=${encodeURIComponent(query.trim())}`
    : null
  const state = useMovies(path)
  return (
    <section>
      <label>
        Film ara <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <MovieList state={state} />
    </section>
  )
}
export function MoviePages() {
  const [page, setPage] = useState<'popular' | 'search'>('popular')
  return (
    <main>
      <nav>
        <button onClick={() => setPage('popular')}>Popüler</button>
        <button onClick={() => setPage('search')}>Arama</button>
      </nav>
      {page === 'popular' ? <Popular /> : <Search />}
    </main>
  )
}
