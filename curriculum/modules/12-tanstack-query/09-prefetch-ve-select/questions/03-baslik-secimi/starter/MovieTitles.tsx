import { useQuery } from '@tanstack/react-query'
export function MovieTitles() {
  const query = useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: async () => ({ results: [] as { id: number; title: string }[] }),
  })
  return <p>Başlıklar bekleniyor</p>
}
