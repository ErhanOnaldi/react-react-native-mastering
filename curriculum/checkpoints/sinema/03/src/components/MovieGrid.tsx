import type { Movie } from '../types/tmdb'
import { MovieCard } from './MovieCard'

interface MovieGridProps {
  movies: Movie[]
  favoriteIds: number[]
  onToggleFavorite: (id: number) => void
}

export function MovieGrid({ movies, favoriteIds, onToggleFavorite }: MovieGridProps) {
  if (movies.length === 0) return <p role="status">Film bulunamadı</p>

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={favoriteIds.includes(movie.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
