import type { Movie } from '../types/tmdb'
import { formatVote, releaseYear } from '../lib/format'
import { posterUrl } from '../lib/tmdb-image'

interface MovieCardProps {
  movie: Movie
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
}

export function MovieCard({ movie, isFavorite, onToggleFavorite }: MovieCardProps) {
  const poster = posterUrl(movie.poster_path)

  return (
    <article className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
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
        <h2 className="text-lg font-semibold">{movie.title}</h2>
        <p className="text-sm text-slate-300">
          {releaseYear(movie.release_date)} · {formatVote(movie.vote_average)}
        </p>
        <button
          type="button"
          aria-label={`${movie.title} ${isFavorite ? 'Favoriden çıkar' : 'Favoriye ekle'}`}
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(movie.id)}
          className="rounded-lg border border-slate-500 px-3 py-2 text-sm hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          {isFavorite ? 'Favoriden çıkar' : 'Favoriye ekle'}
        </button>
      </div>
    </article>
  )
}
