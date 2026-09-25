import { queryOptions } from '@tanstack/react-query'
export function detailOptions(id: number) {
  return queryOptions({
    queryKey: ['movies', 'detail', id],
    queryFn: async () => ({ id, title: '' }),
    staleTime: 0,
    gcTime: 0,
  })
}
