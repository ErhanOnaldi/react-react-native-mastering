import { useState } from 'react'
import { movies } from './movies'

export function MovieSummary() {
  const [selectedId, setSelectedId] = useState(550)
  const [summary] = useState(`${movies[0].title}: ${movies[0].runtime} dakika`)

  return (
    <section>
      <div>
        {movies.map((movie) => (
          <button
            key={movie.id}
            aria-pressed={selectedId === movie.id}
            onClick={() => setSelectedId(movie.id)}
          >
            {movie.title}
          </button>
        ))}
      </div>
      <p aria-label="Film özeti">{summary}</p>
    </section>
  )
}
