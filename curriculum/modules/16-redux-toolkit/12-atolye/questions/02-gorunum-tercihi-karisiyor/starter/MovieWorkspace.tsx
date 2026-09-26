import { useEffect, useState } from 'react'

type Movie = { id: number; title: string }

interface WorkspaceState {
  genre: string
  view: 'list' | 'grid'
  movies: Movie[]
  favorites: boolean[]
}

export function MovieWorkspace() {
  const [state, setState] = useState<WorkspaceState>({
    genre: '28',
    view: 'list',
    movies: [],
    favorites: [],
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')

  useEffect(() => {
    let current = true
    setStatus('loading')
    const url = new URL('https://api.themoviedb.org/3/discover/movie')
    url.searchParams.set('with_genres', state.genre)
    url.searchParams.set('language', 'tr-TR')
    fetch(url, { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` } })
      .then((response) => {
        if (!response.ok) throw new Error('Liste yüklenemedi')
        return response.json() as Promise<{ results: Movie[] }>
      })
      .then((data) => {
        if (current) {
          setState((prev) => ({
            ...prev,
            movies: data.results,
            favorites: data.results.map(() => false),
          }))
          setStatus('success')
        }
      })
      .catch(() => {
        if (current) setStatus('error')
      })
    return () => {
      current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.genre])

  function setGenre(genre: string) {
    setState((prev) => ({ ...prev, genre }))
  }

  function setView(view: 'list' | 'grid') {
    setState((prev) => ({ ...prev, view, movies: [], favorites: [] }))
  }

  function toggleFavorite(index: number) {
    setState((prev) => {
      const favorites = [...prev.favorites]
      favorites[index] = !favorites[index]
      return { ...prev, favorites }
    })
  }

  return (
    <section>
      <label>
        Tür
        <select
          aria-label="Tür"
          value={state.genre}
          onChange={(event) => setGenre(event.target.value)}
        >
          <option value="28">Aksiyon</option>
          <option value="35">Komedi</option>
        </select>
      </label>
      <button
        aria-pressed={state.view === 'grid'}
        onClick={() => setView(state.view === 'list' ? 'grid' : 'list')}
      >
        Kart görünümü
      </button>
      {status === 'loading' && <p>Yükleniyor</p>}
      {status === 'error' && <p role="alert">Liste yüklenemedi</p>}
      {status === 'success' && (
        <ul>
          {state.movies.map((movie, index) => (
            <li key={movie.id}>
              {movie.title}
              <button
                aria-pressed={state.favorites[index] ?? false}
                onClick={() => toggleFavorite(index)}
              >
                {movie.title} favori
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
