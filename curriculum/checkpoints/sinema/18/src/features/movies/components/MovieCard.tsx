import { Link } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { movieQueries } from '@/features/movies/api/movie-queries'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { toggleFavorite } from '@/features/favorites/store/favoritesSlice'
import type { Movie } from '@/features/movies/types'
import { formatVote, releaseYear } from '@/shared/lib/format'
import { posterUrl } from '@/shared/lib/tmdb-image'
import { Badge } from '@/shared/ui/badge'
import { OptimisticFavoriteButton } from '@/features/favorites/components/OptimisticFavoriteButton'
import { Card } from '@/shared/ui/card'

export function MovieCard({ movie }: { movie: Movie }) {
  const isFavorite = useAppSelector((state) =>
    state.favorites.ids.includes(movie.id),
  )
  const dispatch = useAppDispatch()
  const poster = posterUrl(movie.poster_path)
  const queryClient = useQueryClient()

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
            onMouseEnter={() => {
              void queryClient.prefetchQuery(movieQueries.detail(movie.id))
            }}
            onFocus={() => {
              void queryClient.prefetchQuery(movieQueries.detail(movie.id))
            }}
          >
            {movie.title}
          </Link>
        </h2>
        <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          {releaseYear(movie.release_date)}{' '}
          <Badge>{formatVote(movie.vote_average)}</Badge>
        </p>
        <OptimisticFavoriteButton
          initialFavorite={isFavorite}
          onSave={async () => {
            dispatch(toggleFavorite(movie.id))
          }}
        />
      </div>
    </Card>
  )
}
