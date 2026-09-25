import { useInfiniteQuery } from '@tanstack/react-query'
export function TrendingFeed() {
  const feed = useInfiniteQuery({
    queryKey: ['trending'],
    queryFn: async () => ({
      page: 1,
      total_pages: 1,
      results: [] as { id: number; title: string }[],
    }),
    initialPageParam: 1,
    getNextPageParam: () => undefined,
  })
  return <p>Trend bekleniyor</p>
}
