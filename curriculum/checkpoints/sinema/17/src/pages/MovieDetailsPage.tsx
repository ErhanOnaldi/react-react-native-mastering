import { Component, Suspense, useEffect, type ReactNode } from 'react'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { Button } from '@/shared/ui/button'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { toggleFavorite } from '@/features/favorites/store/favoritesSlice'
import { viewMovie } from '@/features/recentlyViewed/store/recentlyViewedSlice'
import { addMovie } from '@/features/watchlists/store/watchlistsSlice'
import { movieQueries } from '@/features/movies/api/movie-queries'
import { getGuestSession } from '@/features/rating/api/rating-api'
import { ratedMoviesQuery } from '@/features/rating/api/rating-queries'
import { RatingStars } from '@/features/rating/components/RatingStars'
import { useRateMovie } from '@/features/rating/hooks/useRateMovie'
import { ReviewForm } from '@/features/watchlists/ReviewForm'
import { formatVote, releaseYear } from '@/shared/lib/format'
import { posterUrl } from '@/shared/lib/tmdb-image'

interface BoundaryState {
  error: Error | null
}

class DetailErrorBoundary extends Component<
  { children: ReactNode },
  BoundaryState
> {
  state: BoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error }
  }

  render() {
    if (this.state.error)
      return <p role="alert">Film bulunamadı: {this.state.error.message}</p>
    return this.props.children
  }
}

export function MovieDetailsPage() {
  const { id } = useParams()
  const movieId = id && /^[1-9]\d*$/.test(id) ? Number(id) : NaN
  if (!Number.isSafeInteger(movieId))
    return <p role="alert">Geçersiz film adresi.</p>

  return (
    <DetailErrorBoundary key={movieId}>
      <Suspense fallback={<p role="status">Film yükleniyor…</p>}>
        <MovieDetail movieId={movieId} />
      </Suspense>
    </DetailErrorBoundary>
  )
}

export default MovieDetailsPage

function MovieDetail({ movieId }: { movieId: number }) {
  const { data: movie } = useSuspenseQuery(movieQueries.detail(movieId))
  const isFavorite = useAppSelector((state) =>
    state.favorites.ids.includes(movieId),
  )
  const watchlists = useAppSelector((state) => state.watchlists.lists)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(viewMovie(movieId))
  }, [dispatch, movieId])
  const poster = posterUrl(movie.poster_path)

  return (
    <article className="space-y-5">
      <Link to="/" className="underline underline-offset-4">
        Ana sayfaya dön
      </Link>
      <h2 className="text-3xl font-bold">{movie.title}</h2>
      <div className="grid gap-6 sm:grid-cols-[12rem_1fr]">
        {poster ? (
          <img
            src={poster}
            alt={`${movie.title} afişi`}
            className="w-full rounded-lg"
          />
        ) : (
          <p>Afiş bulunamadı</p>
        )}
        <div className="space-y-4">
          <p>
            {releaseYear(movie.release_date)} · Puan:{' '}
            {formatVote(movie.vote_average)}
          </p>
          <p>{movie.overview}</p>
          <Button
            variant="ghost"
            aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favoriye ekle'}
            aria-pressed={isFavorite}
            onClick={() => dispatch(toggleFavorite(movie.id))}
          >
            {isFavorite ? 'Favorilerden çıkar' : 'Favoriye ekle'}
          </Button>
          <MovieRating movieId={movie.id} />
        </div>
      </div>
      {watchlists.length > 0 && (
        <section aria-label="İzleme listesine ekle" className="space-y-2">
          <h3 className="text-xl font-semibold">İzleme listesine ekle</h3>
          <ul className="flex flex-wrap gap-2">
            {watchlists.map((list) => {
              const included = list.movieIds.includes(movieId)
              return (
                <li key={list.id}>
                  <Button
                    variant="secondary"
                    disabled={included}
                    onClick={() =>
                      dispatch(addMovie({ listId: list.id, movieId }))
                    }
                  >
                    {included
                      ? `${list.name} listesinde`
                      : `${list.name} listesine ekle`}
                  </Button>
                </li>
              )
            })}
          </ul>
        </section>
      )}
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
      <section aria-label="Yorum yaz" className="space-y-3">
        <h3 className="text-xl font-semibold">Yorum yaz</h3>
        <ReviewForm postId={movie.id} />
      </section>
    </article>
  )
}

function MovieRating({ movieId }: { movieId: number }) {
  const session = useQuery({
    queryKey: ['guest-session'],
    queryFn: getGuestSession,
  })
  if (session.isPending) return <p role="status">Puanlama oturumu açılıyor…</p>
  if (session.isError)
    return (
      <p role="alert">Puanlama oturumu açılamadı: {session.error.message}</p>
    )
  return <RatingForSession movieId={movieId} sessionId={session.data} />
}

function RatingForSession({
  movieId,
  sessionId,
}: {
  movieId: number
  sessionId: string
}) {
  const rated = useQuery(ratedMoviesQuery(sessionId))
  const mutation = useRateMovie(sessionId)
  if (rated.isPending) return <p role="status">Puanın yükleniyor…</p>
  if (rated.isError)
    return <p role="alert">Puanın alınamadı: {rated.error.message}</p>

  return (
    <RatingStars
      movieId={movieId}
      value={
        rated.data.results.find((movie) => movie.id === movieId)?.rating ?? null
      }
      onRate={(value) => mutation.mutate({ movieId, value })}
      pending={mutation.isPending}
      error={mutation.error?.message}
    />
  )
}
