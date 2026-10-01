import { useMutation, useQueryClient } from '@tanstack/react-query'
export interface RatedMovie {
  id: number
  title: string
  rating: number
}
export function useDeleteRating(sessionId: string, remove: (id: number) => Promise<void>) {
  const client = useQueryClient()
  const key = ['ratings', sessionId] as const
  return useMutation({
    mutationFn: remove,
    onMutate: async (movieId) => {
      await client.cancelQueries({ queryKey: key })
      const previous = client.getQueryData<RatedMovie[]>(key)
      client.setQueryData<RatedMovie[]>(key, (old) => old?.filter((movie) => movie.id !== movieId))
      return { previous }
    },
    onError: (_error, _movieId, context) => client.setQueryData(key, context?.previous),
    onSuccess: () => client.invalidateQueries({ queryKey: key }),
  })
}
