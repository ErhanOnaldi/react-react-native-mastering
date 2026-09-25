import { useEffect, useState } from 'react'
import { MovieGrid } from '../components/MovieGrid'
import { useFavorites } from '../context/FavoritesContext'
import { tmdbFetch } from '../lib/tmdb'
import type { Movie, MovieDetails } from '../types/tmdb'

export function FavoritesPage() {
  const { favoriteIds, toggleFavorite } = useFavorites()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const ids = favoriteIds.join(',')

  useEffect(() => {
    if (!ids) {
      setMovies([])
      setLoading(false)
      return
    }
    let ignore = false
    setLoading(true)
    setError('')
    Promise.all(ids.split(',').map((id) => tmdbFetch<MovieDetails>(`/movie/${id}`)))
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
        if (!ignore) setError(reason instanceof Error ? reason.message : String(reason))
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
          <MovieGrid movies={movies} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />
        ) : (
          <p role="status">Henüz favori filmin yok.</p>
        ))}
    </>
  )
}
