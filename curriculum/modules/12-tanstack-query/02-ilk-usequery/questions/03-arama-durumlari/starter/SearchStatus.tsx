import { useQuery } from '@tanstack/react-query'
export function SearchStatus({ query }: { query: string }) {
  const result = useQuery({
    queryKey: ['search', query],
    queryFn: async () => ({ results: [] as { title: string }[] }),
  })
  return <p>Arama hazırlanıyor</p>
}
