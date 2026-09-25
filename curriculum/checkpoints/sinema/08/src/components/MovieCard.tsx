import { Link } from 'react-router'
import type { Movie } from '../types/tmdb'
import { formatVote, releaseYear } from '../lib/format'
import { posterUrl } from '../lib/tmdb-image'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface MovieCardProps {
  movie: Movie
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
}

export function MovieCard({
  movie,
  isFavorite,
  onToggleFavorite,
}: MovieCardProps) {
  const poster = posterUrl(movie.poster_path)

  return (
    <Card className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
      {poster ? (
        <img
          className="aspect-[2/3] w-full object-cover"
          src={poster}
          alt={`${movie.title} afişi`}
        />
      ) : (
        <div className="flex aspect-[2/3] items-center justify-center bg-slate-800 text-slate-300">
          Afiş bulunamadı
        </div>
      )}
      <div className="space-y-3 p-4">
        <h2 className="text-lg font-semibold">
          <Link
            className="hover:underline focus-visible:underline"
            to={`/movie/${movie.id}`}
          >
            {movie.title}
          </Link>
        </h2>
        <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          {releaseYear(movie.release_date)}{' '}
          <Badge>{formatVote(movie.vote_average)}</Badge>
        </p>
        <Button
          variant="ghost"
          aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favoriye ekle'}
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(movie.id)}
        >
          {isFavorite ? 'Favorilerden çıkar' : 'Favoriye ekle'}
        </Button>
      </div>
    </Card>
  )
}
