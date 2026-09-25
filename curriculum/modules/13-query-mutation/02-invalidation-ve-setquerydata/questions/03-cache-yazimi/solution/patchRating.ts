import type { QueryClient } from '@tanstack/react-query'
export interface RatedMovie {
  id: number
  title: string
  rating: number
}
export function patchRating(
  client: QueryClient,
  sessionId: string,
  movieId: number,
  value: number,
): void {
  client.setQueryData<RatedMovie[]>(['ratings', sessionId], (old) =>
    old?.map((movie) => (movie.id === movieId ? { ...movie, rating: value } : movie)),
  )
}
