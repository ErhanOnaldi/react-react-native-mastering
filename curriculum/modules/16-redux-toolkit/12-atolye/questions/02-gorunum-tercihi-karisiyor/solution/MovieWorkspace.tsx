import { useEffect, useState } from 'react'

type Movie = { id: number; title: string }

export function MovieWorkspace() {
  const [genre, setGenre] = useState('28')
  const [view, setView] = useState<'list' | 'grid'>('list')
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [movies, setMovies] = useState<Movie[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')

  useEffect(() => {
    let current = true
    setStatus('loading')
    const url = new URL('https://api.themoviedb.org/3/discover/movie')
    url.searchParams.set('with_genres', genre)
    url.searchParams.set('language', 'tr-TR')
    fetch(url, { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` } })
      .then((response) => {
        if (!response.ok) throw new Error('Liste yüklenemedi')
        return response.json() as Promise<{ results: Movie[] }>
      })
      .then((data) => {
        if (current) {
          setMovies(data.results)
          setStatus('success')
        }
      })
      .catch(() => {
        if (current) setStatus('error')
      })
    return () => {
      current = false
    }
  }, [genre])

  function toggleFavorite(id: number) {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section>
      <label>
        Tür
        <select aria-label="Tür" value={genre} onChange={(event) => setGenre(event.target.value)}>
          <option value="28">Aksiyon</option>
          <option value="35">Komedi</option>
        </select>
      </label>
      <button
        aria-pressed={view === 'grid'}
        onClick={() => setView(view === 'list' ? 'grid' : 'list')}
      >
        Kart görünümü
      </button>
      {status === 'loading' && <p>Yükleniyor</p>}
      {status === 'error' && <p role="alert">Liste yüklenemedi</p>}
      {status === 'success' && (
        <ul data-view={view}>
          {movies.map((movie) => (
            <li key={movie.id}>
              {movie.title}
              <button
                aria-pressed={favorites.has(movie.id)}
                onClick={() => toggleFavorite(movie.id)}
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
