import { useEffect, useState } from 'react'

type Movie = { id: number; title: string }
export function MovieSearch() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  useEffect(() => {
    let active = true
    setMovies([])
    if (!query.trim())
      return () => {
        active = false
      }
    const url = new URL('https://api.themoviedb.org/3/search/movie')
    url.searchParams.set('query', query.trim())
    url.searchParams.set('language', 'tr-TR')
    fetch(url, { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` } })
      .then((response) => {
        if (!response.ok) throw new Error('Arama başarısız')
        return response.json() as Promise<{ results: Movie[] }>
      })
      .then((data) => {
        if (active) setMovies(data.results)
      })
      .catch(() => {
        if (active) setMovies([])
      })
    return () => {
      active = false
    }
  }, [query])
  return (
    <section>
      <label>
        Film ara <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </section>
  )
}
