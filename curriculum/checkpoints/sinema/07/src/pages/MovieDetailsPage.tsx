import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Button } from '../components/ui/button'
import { useFavorites } from '../context/FavoritesContext'
import { formatVote, releaseYear } from '../lib/format'
import { tmdbFetch } from '../lib/tmdb'
import { posterUrl } from '../lib/tmdb-image'
import type { MovieDetails } from '../types/tmdb'

export function MovieDetailsPage() {
  const { id } = useParams()
  const { isFavorite, toggleFavorite } = useFavorites()
  const movieId = id && /^[1-9]\d*$/.test(id) ? Number(id) : NaN
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Bilinçli v1 kusuru: id değişince bu effect yeniden çalışmıyor. Modül 8'de lint yakalayacak.
  useEffect(() => {
    if (!Number.isSafeInteger(movieId)) return
    let ignore = false
    setLoading(true)
    setError('')
    tmdbFetch<MovieDetails>(`/movie/${movieId}`, { append_to_response: 'credits,videos' })
      .then((result) => {
        if (!ignore) setMovie(result)
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
  }, [])

  if (!Number.isSafeInteger(movieId)) return <p role="alert">Geçersiz film adresi.</p>
  if (loading) return <p role="status">Film yükleniyor…</p>
  if (error) return <p role="alert">Film bulunamadı: {error}</p>
  if (!movie) return <p role="status">Film bulunamadı.</p>

  const poster = posterUrl(movie.poster_path)
  return (
    <article className="space-y-5">
      <Link to="/" className="underline underline-offset-4">
        Ana sayfaya dön
      </Link>
      <h2 className="text-3xl font-bold">{movie.title}</h2>
      <div className="grid gap-6 sm:grid-cols-[12rem_1fr]">
        {poster ? (
          <img src={poster} alt={`${movie.title} afişi`} className="w-full rounded-lg" />
        ) : (
          <p>Afiş bulunamadı</p>
        )}
        <div className="space-y-4">
          <p>
            {releaseYear(movie.release_date)} · Puan: {formatVote(movie.vote_average)}
          </p>
          <p>{movie.overview}</p>
          <Button
            variant="ghost"
            aria-label={isFavorite(movie.id) ? 'Favorilerden çıkar' : 'Favoriye ekle'}
            aria-pressed={isFavorite(movie.id)}
            onClick={() => toggleFavorite(movie.id)}
          >
            {isFavorite(movie.id) ? 'Favorilerden çıkar' : 'Favoriye ekle'}
          </Button>
        </div>
      </div>
      <section aria-label="Oyuncu kadrosu">
        <h3 className="text-xl font-semibold">Oyuncular</h3>
        <ul>
          {movie.credits?.cast.slice(0, 10).map((person) => (
            <li key={person.id}>
              {person.name} — {person.character}
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
