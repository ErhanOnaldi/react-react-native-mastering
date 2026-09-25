import { useQuery } from '@tanstack/react-query'
type Page = { results: { id: number; title: string }[] }
export function MovieTitles() {
  const query = useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: async (): Promise<Page> => {
      const response = await fetch(
        'https://api.themoviedb.org/3/movie/popular?page=1&language=tr-TR',
        { headers: { Authorization: 'Bearer test-token' } },
      )
      if (!response.ok) throw new Error('Başlıklar yüklenemedi')
      return response.json()
    },
    select: (page) => page.results.map((movie) => movie.title),
  })
  if (query.isPending) return <p>Yükleniyor</p>
  if (query.isError) return <p role="alert">Başlıklar yüklenemedi</p>
  return (
    <ol>
      {query.data.map((title) => (
        <li key={title}>{title}</li>
      ))}
    </ol>
  )
}
