import { useEffect, useState } from 'react'

type Movie = { id: number; title: string }
type MovieResponse = { results: Movie[] }

export function MovieSearch() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    let active = true
    if (!query.trim()) {
      setMovies([])
      return () => {
        active = false
      }
    }
    fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then((response) => response.json() as Promise<MovieResponse>)
      .then((data) => {
        if (active) setMovies(data.results)
      })
    return () => {
      active = false
    }
  }, [query])

  return (
    <section>
      <label>
        Film ara
        <input value={query} onChange={(event) => setQuery(event.currentTarget.value)} />
      </label>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </section>
  )
}
