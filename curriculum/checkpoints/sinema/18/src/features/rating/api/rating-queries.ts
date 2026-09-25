import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod'
import { movieSchema } from '@/features/movies/api/schemas'
import type { Movie, Paginated } from '@/features/movies/types'
import { tmdbClient } from '@/shared/api/tmdb-client'

export type RatedMovie = Movie & { rating: number }
export type RatedMoviesResponse = Paginated<RatedMovie>

export function ratedMoviesQuery(sessionId: string) {
  return queryOptions({
    queryKey: ['ratings', sessionId] as const,
    queryFn: () =>
      tmdbClient.get(
        `/guest_session/${encodeURIComponent(sessionId)}/rated/movies`,
        z.object({
          page: z.number(),
          results: z.array(movieSchema.extend({ rating: z.number() })),
          total_pages: z.number(),
          total_results: z.number(),
        }),
      ),
  })
}
