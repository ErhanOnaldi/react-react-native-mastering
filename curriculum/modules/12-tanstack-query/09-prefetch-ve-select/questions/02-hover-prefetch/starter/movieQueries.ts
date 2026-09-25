import { queryOptions } from '@tanstack/react-query'
export const movieQueries = {
  detail: (id: number) =>
    queryOptions({
      queryKey: ['movies', 'detail', id] as const,
      queryFn: async (): Promise<{ title: string }> => {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=tr-TR`, {
          headers: { Authorization: 'Bearer test-token' },
        })
        if (!response.ok) throw new Error('Film yüklenemedi')
        return response.json()
      },
      staleTime: 60_000,
    }),
}
