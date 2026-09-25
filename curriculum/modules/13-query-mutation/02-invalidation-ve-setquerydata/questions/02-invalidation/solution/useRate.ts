import { useMutation, useQueryClient } from '@tanstack/react-query'
export function useRate(
  rate: (input: { movieId: number; value: number }) => Promise<void>,
  sessionId: string,
) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: rate,
    onSuccess: () => client.invalidateQueries({ queryKey: ['ratings', sessionId] }),
  })
}
