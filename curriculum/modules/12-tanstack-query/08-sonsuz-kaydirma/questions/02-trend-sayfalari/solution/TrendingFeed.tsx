import { useInfiniteQuery } from '@tanstack/react-query'
type Page = { page: number; total_pages: number; results: { id: number; title: string }[] }
export function TrendingFeed() {
  const feed = useInfiniteQuery({
    queryKey: ['movies', 'trending'],
    queryFn: async ({ pageParam }): Promise<Page> => {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?page=${pageParam}&language=tr-TR`,
        { headers: { Authorization: 'Bearer test-token' } },
      )
      if (!response.ok) throw new Error('Trend yüklenemedi')
      return response.json()
    },
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.total_pages ? last.page + 1 : undefined),
    maxPages: 3,
  })
  if (feed.isPending) return <p>Yükleniyor</p>
  if (feed.isError) return <p role="alert">Trend yüklenemedi</p>
  const movies = feed.data.pages.flatMap((page) => page.results)
  return (
    <section>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
      <button
        disabled={!feed.hasNextPage || feed.isFetchingNextPage}
        onClick={() => void feed.fetchNextPage()}
      >
        Daha fazla
      </button>
    </section>
  )
}
