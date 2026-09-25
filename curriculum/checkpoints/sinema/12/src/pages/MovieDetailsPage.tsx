import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { Button } from '@/shared/ui/button'
import { useFavorites } from '@/features/favorites/context/useFavorites'
import { movieQueries } from '@/features/movies/api/movie-queries'
import { formatVote, releaseYear } from '@/shared/lib/format'
import { posterUrl } from '@/shared/lib/tmdb-image'

export function MovieDetailsPage() {
  const { id } = useParams()
  const { isFavorite, toggleFavorite } = useFavorites()
  const movieId = id && /^[1-9]\d*$/.test(id) ? Number(id) : NaN
  const validId = Number.isSafeInteger(movieId)
  const detail = useQuery({ ...movieQueries.detail(movieId), enabled: validId })

  if (!validId) return <p role="alert">Geçersiz film adresi.</p>
  if (detail.isPending) return <p role="status">Film yükleniyor…</p>
  if (detail.isError) return <p role="alert">Film bulunamadı: {detail.error.message}</p>

  const movie = detail.data
  const poster = posterUrl(movie.poster_path)
  return (
    <article className="space-y-5">
      <Link to="/" className="underline underline-offset-4">Ana sayfaya dön</Link>
      <h2 className="text-3xl font-bold">{movie.title}</h2>
      <div className="grid gap-6 sm:grid-cols-[12rem_1fr]">
        {poster ? <img src={poster} alt={`${movie.title} afişi`} className="w-full rounded-lg" /> : <p>Afiş bulunamadı</p>}
        <div className="space-y-4">
          <p>{releaseYear(movie.release_date)} · Puan: {formatVote(movie.vote_average)}</p>
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
            <li key={person.id}>{person.name} — {person.character}</li>
          ))}
        </ul>
      </section>
    </article>
  )
}
