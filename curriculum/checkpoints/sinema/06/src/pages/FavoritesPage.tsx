import { MovieGrid } from '../components/MovieGrid'
import { useFavorites } from '../context/FavoritesContext'
import { sampleMovies } from '../data/sample-movies'

export function FavoritesPage() {
  const { favoriteIds, toggleFavorite } = useFavorites()
  const movies = sampleMovies.filter((movie) => favoriteIds.includes(movie.id))

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">Favoriler</h2>
      {movies.length === 0 ? (
        <p role="status">Henüz favori filmin yok.</p>
      ) : (
        <MovieGrid movies={movies} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />
      )}
    </>
  )
}
