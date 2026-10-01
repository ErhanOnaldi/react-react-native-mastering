import { useQuery } from '@tanstack/react-query'
export function useOptionalMovie(id: number | undefined) {
  return useQuery({
    queryKey: ['movies', 'detail', id],
    enabled: id !== undefined,
    queryFn: async (): Promise<{ title: string }> => {
      if (id === undefined) throw new Error('Film id gerekli')
      const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=tr-TR`, {
        headers: { Authorization: 'Bearer test-token' },
      })
      if (!response.ok) throw new Error('Film yüklenemedi')
      return response.json()
    },
  })
}
