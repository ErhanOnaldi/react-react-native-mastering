import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

type Movie = { id: number; title: string }
export function SearchWorkspace() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const page = Math.max(1, Number(params.get('page') ?? '1') || 1)
  const [open, setOpen] = useState(false)
  const [movies, setMovies] = useState<Movie[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  useEffect(() => {
    let current = true
    setOpen(false)
    if (!query.trim()) {
      setMovies([])
      setStatus('idle')
      return
    }
    setStatus('loading')
    const url = new URL('https://api.themoviedb.org/3/search/movie')
    url.searchParams.set('query', query)
    url.searchParams.set('page', String(page))
    url.searchParams.set('language', 'tr-TR')
    fetch(url, { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` } })
      .then((response) => {
        if (!response.ok) throw new Error('Arama başarısız')
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
  }, [query, page])
  return (
    <main>
      <label>
        Arama{' '}
        <input
          value={query}
          onChange={(event) => setParams({ q: event.target.value, page: '1' })}
        />
      </label>
      <button
        onClick={() => setParams({ q: query, page: String(Math.max(1, page - 1)) })}
        disabled={page === 1}
      >
        Önceki sayfa
      </button>
      <button onClick={() => setParams({ q: query, page: String(page + 1) })}>Sonraki sayfa</button>
      <button onClick={() => setOpen(!open)}>Bilgi</button>
      {open && <p>Arama bilgisi</p>}
      {status === 'loading' && <p>Yükleniyor</p>}
      {status === 'error' && <p role="alert">Arama yüklenemedi</p>}
      {status === 'success' && (
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      )}
    </main>
  )
}
