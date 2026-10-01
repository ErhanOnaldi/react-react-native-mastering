import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'

type Movie = { id: number; title: string }
type MovieResponse = { results: Movie[] }

export function SearchPage() {
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''
  const [movies, setMovies] = useState<Movie[]>([])

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
