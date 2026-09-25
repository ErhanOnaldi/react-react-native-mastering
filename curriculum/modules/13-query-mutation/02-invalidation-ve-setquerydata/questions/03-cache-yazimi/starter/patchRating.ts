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
  void client
  void sessionId
  void movieId
  void value
}
