import { queryOptions } from '@tanstack/react-query'
export const movieQueries = {
  all: ['movies'] as const,
  detail: (id: number) =>
    queryOptions({
      queryKey: ['movies', 'detail'] as const,
      queryFn: async () => ({ id: 0, title: '' }),
    }),
  search: (query: string, page: number) =>
    queryOptions({
      queryKey: ['movies', 'search'] as const,
      queryFn: async () => ({ page: 0, results: [] as { id: number; title: string }[] }),
    }),
}
