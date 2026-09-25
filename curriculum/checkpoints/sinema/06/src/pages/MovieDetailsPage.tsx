import { Link, useParams } from 'react-router'
import { useFavorites } from '../context/FavoritesContext'
import { sampleMovies } from '../data/sample-movies'
import { formatVote, releaseYear } from '../lib/format'
import { posterUrl } from '../lib/tmdb-image'
import { Button } from '../components/ui/button'

export function MovieDetailsPage() {
  const { id } = useParams()
  const { isFavorite, toggleFavorite } = useFavorites()
  const movieId = id && /^[1-9]\d*$/.test(id) ? Number(id) : NaN

  if (!Number.isSafeInteger(movieId)) {
    return <p role="alert">Geçersiz film adresi.</p>
  }

  const movie = sampleMovies.find((item) => item.id === movieId)
  if (!movie) {
    return <p role="status">Film bulunamadı.</p>
  }

  const poster = posterUrl(movie.poster_path)
  const favorite = isFavorite(movie.id)

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
            aria-label={favorite ? 'Favorilerden çıkar' : 'Favoriye ekle'}
            aria-pressed={favorite}
            onClick={() => toggleFavorite(movie.id)}
          >
            {favorite ? 'Favorilerden çıkar' : 'Favoriye ekle'}
          </Button>
        </div>
      </div>
    </article>
  )
}
