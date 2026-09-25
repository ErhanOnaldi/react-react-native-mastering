import { useMutation } from '@tanstack/react-query'
export interface Rated {
  id: number
  title: string
  rating: number
}
export function useOptimisticRating(sessionId: string) {
  void sessionId
  return useMutation({
    mutationFn: async (_input: { movieId: number; value: number; title: string }) => {},
  })
}
