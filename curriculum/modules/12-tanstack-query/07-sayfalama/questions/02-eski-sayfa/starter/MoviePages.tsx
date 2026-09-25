import { useQuery } from '@tanstack/react-query'
export function MoviePages({ page }: { page: number }) {
  const query = useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: async () => ({ page: 1, results: [] as { id: number; title: string }[] }),
  })
  return <p>Sayfa bekleniyor</p>
}
