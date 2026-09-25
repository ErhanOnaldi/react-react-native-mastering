import { skipToken, useQuery } from '@tanstack/react-query'
export function useOptionalMovie(id: number | undefined) {
  return useQuery({
    queryKey: ['movies', 'detail', id],
    queryFn:
      id === undefined
        ? skipToken
        : async (): Promise<{ title: string }> => {
            const response = await fetch(
              `https://api.themoviedb.org/3/movie/${id}?language=tr-TR`,
              { headers: { Authorization: 'Bearer test-token' } },
            )
            if (!response.ok) throw new Error('Film yüklenemedi')
            return response.json()
          },
  })
}
