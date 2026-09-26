import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

type Movie = { id: number; title: string }

const GENRES = [
  { id: '28', label: 'Aksiyon' },
  { id: '35', label: 'Komedi' },
]

export function MovieWorkspace() {
  const [params, setParams] = useSearchParams()
  const genre = GENRES.some((g) => g.id === params.get('genre')) ? params.get('genre')! : '28'
  const page = Math.max(1, Number(params.get('page') ?? '1') || 1)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [movies, setMovies] = useState<Movie[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')

  useEffect(() => {
    let current = true
    setStatus('loading')
    const url = new URL('https://api.themoviedb.org/3/discover/movie')
    url.searchParams.set('with_genres', genre)
    url.searchParams.set('page', String(page))
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
  }, [genre, page])

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
        <select
          aria-label="Tür"
          value={genre}
          onChange={(event) => setParams({ genre: event.target.value, page: '1' })}
        >
          {GENRES.map((g) => (
            <option key={g.id} value={g.id}>
              {g.label}
            </option>
          ))}
        </select>
      </label>
      <button onClick={() => setParams({ genre, page: String(page + 1) })}>Sonraki sayfa</button>
      <p>Sayfa {page}</p>
      {status === 'loading' && <p>Yükleniyor</p>}
      {status === 'error' && <p role="alert">Liste yüklenemedi</p>}
      {status === 'success' && (
        <ul>
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
