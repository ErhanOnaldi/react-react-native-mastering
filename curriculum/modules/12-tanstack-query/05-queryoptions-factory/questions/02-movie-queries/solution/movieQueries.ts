import { queryOptions } from '@tanstack/react-query'
type Movie = { id: number; title: string }
type List = { page: number; results: Movie[] }
async function get<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL('https://api.themoviedb.org/3' + path)
  url.searchParams.set('language', 'tr-TR')
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value))
  const response = await fetch(url, { headers: { Authorization: 'Bearer test-token' } })
  if (!response.ok) throw new Error('TMDB isteği başarısız')
  return response.json() as Promise<T>
}
export const movieQueries = {
  all: ['movies'] as const,
  detail: (id: number) =>
    queryOptions({
      queryKey: ['movies', 'detail', id] as const,
      queryFn: () => get<Movie>(`/movie/${id}`),
      staleTime: 60_000,
    }),
  search: (query: string, page: number) =>
    queryOptions({
      queryKey: ['movies', 'search', query.trim(), page] as const,
      queryFn: () => get<List>('/search/movie', { query: query.trim(), page }),
      staleTime: 60_000,
    }),
}
