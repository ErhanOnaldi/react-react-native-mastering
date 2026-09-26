import { useAppSelector } from '@/app/store'
import { useQueries } from '@tanstack/react-query'
import { MovieGrid } from '@/features/movies/components/MovieGrid'
import { movieQueries } from '@/features/movies/api/movie-queries'

export function FavoritesPage() {
  const favoriteIds = useAppSelector((state) => state.favorites.ids)
  const details = useQueries({
    queries: favoriteIds.map((id) => movieQueries.detail(id)),
  })
  const loading = details.some((result) => result.isPending)
  const error = details.find((result) => result.isError)
  const movies = details.flatMap((result) =>
    result.data
      ? [
          {
            ...result.data,
            genre_ids: result.data.genres.map((genre) => genre.id),
          },
        ]
      : [],
  )

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">Favoriler</h2>
      {loading && <p role="status">Favoriler yükleniyor…</p>}
      {error && (
        <p role="alert">Favoriler yüklenemedi: {error.error?.message}</p>
      )}
      {!loading &&
        !error &&
        (movies.length ? (
          <MovieGrid movies={movies} />
        ) : (
          <p role="status">Henüz favori filmin yok.</p>
        ))}
    </>
  )
}
