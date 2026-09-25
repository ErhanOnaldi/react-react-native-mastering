import { useQuery } from '@tanstack/react-query'
export function useOptionalMovie(id: number | undefined) {
  return useQuery({ queryKey: ['movies', 'detail', id], queryFn: async () => ({ title: '' }) })
}
