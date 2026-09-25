import { useEffect, useState } from 'react'
import { MovieGrid } from '@/features/movies/components/MovieGrid'
import { useFavorites } from '@/features/favorites/context/useFavorites'
import { getMovieDetails } from '@/features/movies/api/movies-api'
import type { Movie } from '@/features/movies/types'

export function FavoritesPage() {
  const { favoriteIds, toggleFavorite } = useFavorites()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const ids = favoriteIds.join(',')

  useEffect(() => {
    let ignore = false
    if (!ids) {
      queueMicrotask(() => {
        if (ignore) return
        setMovies([])
        setLoading(false)
      })
      return () => {
        ignore = true
      }
    }
    queueMicrotask(() => {
      if (ignore) return
      setLoading(true)
      setError('')
    })
    Promise.all(ids.split(',').map((id) => getMovieDetails(Number(id))))
      .then((details) => {
        if (!ignore)
          setMovies(
            details.map((movie) => ({
              ...movie,
              genre_ids: movie.genres.map((genre) => genre.id),
            })),
          )
      })
      .catch((reason: unknown) => {
        if (!ignore)
          setError(reason instanceof Error ? reason.message : String(reason))
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [ids])

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">Favoriler</h2>
      {loading && <p role="status">Favoriler yükleniyor…</p>}
      {error && <p role="alert">Favoriler yüklenemedi: {error}</p>}
      {!loading &&
        !error &&
        (movies.length ? (
          <MovieGrid
            movies={movies}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <p role="status">Henüz favori filmin yok.</p>
        ))}
    </>
  )
}
