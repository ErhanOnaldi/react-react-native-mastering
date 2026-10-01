import { useMutation } from '@tanstack/react-query'
export interface Rated {
  id: number
  title: string
  rating: number
}
export function useOptimisticRating(
  sessionId: string,
  rate: (input: { movieId: number; value: number; title: string }) => Promise<void>,
) {
  void sessionId
  return useMutation({ mutationFn: rate })
}
