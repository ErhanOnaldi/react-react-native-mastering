import { useMutation, useQueryClient } from '@tanstack/react-query'
export function useDeleteRating(sessionId: string, remove: (id: number) => Promise<void>) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: remove,
    onSuccess: () => client.invalidateQueries({ queryKey: ['ratings', sessionId] }),
  })
}
