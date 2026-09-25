import { useSearchParams } from 'react-router'
import { MovieGrid } from '../components/MovieGrid'
import { SearchBox } from '../components/SearchBox'
import { useFavorites } from '../context/FavoritesContext'
import { sampleMovies } from '../data/sample-movies'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { favoriteIds, toggleFavorite } = useFavorites()
  const query = searchParams.get('q') ?? ''
  const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR')
  const movies = sampleMovies.filter((movie) =>
    movie.title.toLocaleLowerCase('tr-TR').includes(normalizedQuery),
  )

  function changeQuery(value: string) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (value) next.set('q', value)
      else next.delete('q')
      next.delete('page')
      return next
    })
  }

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">Film ara</h2>
      <SearchBox value={query} onChange={changeQuery} />
      <MovieGrid movies={movies} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />
    </>
  )
}
