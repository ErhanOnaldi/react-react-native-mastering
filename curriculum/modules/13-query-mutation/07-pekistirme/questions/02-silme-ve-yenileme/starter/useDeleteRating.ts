import { useMutation } from '@tanstack/react-query'
export function useDeleteRating(sessionId: string, remove: (id: number) => Promise<void>) {
  void sessionId
  return useMutation({ mutationFn: remove })
}
