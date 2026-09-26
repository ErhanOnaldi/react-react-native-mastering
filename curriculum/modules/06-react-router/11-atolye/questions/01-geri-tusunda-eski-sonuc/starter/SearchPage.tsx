import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'

type Movie = { id: number; title: string }
type MovieResponse = { results: Movie[] }

export function SearchPage() {
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    if (!query.trim()) {
      setMovies([])
      return
    }
    fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then((response) => response.json() as Promise<MovieResponse>)
      .then((data) => setMovies(data.results))
  }, [query])

  return (
    <main>
      <p>Arama: {query}</p>
      <Link to="/search?q=dovus">Dövüş ara</Link>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </main>
  )
}
