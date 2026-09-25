import { MovieGrid } from '../components/MovieGrid'
import { useFavorites } from '../context/FavoritesContext'
import { sampleMovies } from '../data/sample-movies'

export function HomePage() {
  const { favoriteIds, toggleFavorite } = useFavorites()

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">Filmler</h2>
      <MovieGrid
        movies={sampleMovies}
        favoriteIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
      />
    </>
  )
}
