import { useMutation, useQueryClient } from '@tanstack/react-query'
export interface Rated {
  id: number
  title: string
  rating: number
}
export function useOptimisticRating(sessionId: string) {
  const client = useQueryClient()
  const key = ['ratings', sessionId] as const
  return useMutation({
    mutationFn: async ({ movieId, value }: { movieId: number; value: number; title: string }) => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${encodeURIComponent(sessionId)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ value }),
        },
      )
      if (!response.ok) throw new Error(`Puan kaydedilemedi: ${response.status}`)
    },
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
