import { useMutation, useQueryClient } from '@tanstack/react-query'
export interface Rated {
  id: number
  title: string
  rating: number
}
export function useOptimisticRating(
  sessionId: string,
  rate: (input: { movieId: number; value: number; title: string }) => Promise<void>,
) {
  const client = useQueryClient()
  const key = ['ratings', sessionId] as const
  return useMutation({
    mutationFn: (input: { movieId: number; value: number; title: string }) => rate(input),
    onMutate: async ({ movieId, value, title }) => {
      await client.cancelQueries({ queryKey: key })
      const previous = client.getQueryData<Rated[]>(key)
      client.setQueryData<Rated[]>(key, (old) => {
        const list = old ?? []
        return list.some((item) => item.id === movieId)
          ? list.map((item) => (item.id === movieId ? { ...item, rating: value } : item))
          : [...list, { id: movieId, title, rating: value }]
      })
      return { previous }
    },
    onError: (_error, _variables, context) => client.setQueryData(key, context?.previous),
    onSettled: () => client.invalidateQueries({ queryKey: key }),
  })
}
