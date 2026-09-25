import { queryOptions } from '@tanstack/react-query'
import type { Movie, Paginated } from '@/features/movies/types'
import { tmdbClient } from '@/shared/api/tmdb-client'

export type RatedMovie = Movie & { rating: number }
export type RatedMoviesResponse = Paginated<RatedMovie>

export function ratedMoviesQuery(sessionId: string) {
  return queryOptions({
    queryKey: ['ratings', sessionId] as const,
    queryFn: () =>
      tmdbClient.get<RatedMoviesResponse>(
        `/guest_session/${encodeURIComponent(sessionId)}/rated/movies`,
      ),
  })
}
