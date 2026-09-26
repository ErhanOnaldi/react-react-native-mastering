import { useState } from 'react'
import { movies } from './movies'

export function MovieShelf() {
  const [reversed, setReversed] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])

  return (
    <section>
      <button onClick={() => setReversed(!reversed)}>Sıralamayı ters çevir</button>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            {movie.title}{' '}
            <button
              aria-label={`${movie.title} favori`}
              aria-pressed={favoriteIds.includes(movie.id)}
              onClick={() => setFavoriteIds([...favoriteIds, movie.id])}
            >
              Favori
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
