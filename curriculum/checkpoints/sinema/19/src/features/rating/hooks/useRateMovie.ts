import { useMutation, useQueryClient } from '@tanstack/react-query'
import { movieQueries } from '@/features/movies/api/movie-queries'
import type { MovieDetails } from '@/features/movies/types'
import { rateMovie } from '@/features/rating/api/rating-api'
import {
  ratedMoviesQuery,
  type RatedMoviesResponse,
} from '@/features/rating/api/rating-queries'

export function useRateMovie(sessionId: string) {
  const client = useQueryClient()
  const key = ratedMoviesQuery(sessionId).queryKey

  return useMutation({
    scope: { id: `rating-${sessionId}` },
    mutationFn: rateMovie,
    onMutate: async ({ movieId, value }) => {
      await client.cancelQueries({ queryKey: key })
      const previous = client.getQueryData<RatedMoviesResponse>(key)
      client.setQueryData<RatedMoviesResponse>(key, (old) => {
        if (!old) return old
        const exists = old.results.some((movie) => movie.id === movieId)
        const detail = client.getQueryData<MovieDetails>(
          movieQueries.detail(movieId).queryKey,
        )
        const updated = exists
          ? old.results.map((movie) =>
              movie.id === movieId ? { ...movie, rating: value } : movie,
            )
          : detail
            ? [
                ...old.results,
                {
                  ...detail,
                  genre_ids: detail.genres.map((genre) => genre.id),
                  rating: value,
                },
              ]
            : old.results
        return {
          ...old,
          results: updated,
          total_results: old.total_results + (exists || !detail ? 0 : 1),
        }
      })
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) client.setQueryData(key, context.previous)
    },
    onSettled: () => client.invalidateQueries({ queryKey: key }),
  })
}
