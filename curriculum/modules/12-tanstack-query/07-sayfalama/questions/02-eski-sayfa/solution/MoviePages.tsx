import { keepPreviousData, useQuery } from '@tanstack/react-query'
type Page = { page: number; total_results: number; results: { id: number; title: string }[] }
export function MoviePages({ page }: { page: number }) {
  const query = useQuery({
    queryKey: ['movies', 'popular', page],
    queryFn: async (): Promise<Page> => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?page=${page}&language=tr-TR`,
        { headers: { Authorization: 'Bearer test-token' } },
      )
      if (!response.ok) throw new Error('Sayfa yüklenemedi')
      return response.json()
    },
    placeholderData: keepPreviousData,
  })
  if (query.isPending) return <p>Yükleniyor</p>
  if (query.isError) return <p role="alert">Sayfa yüklenemedi</p>
  return (
    <section>
      <p>Sayfa {query.data.page}</p>
      <p>Sonuç sayısı: {query.data.total_results}</p>
      {query.isPlaceholderData && <p>Yeni sayfa yükleniyor</p>}
      <ul>
        {query.data.results.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </section>
  )
}
