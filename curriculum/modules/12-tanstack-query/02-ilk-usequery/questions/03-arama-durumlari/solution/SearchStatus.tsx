import { useQuery } from '@tanstack/react-query'
export function SearchStatus({ query }: { query: string }) {
  const result = useQuery({
    queryKey: ['movies', 'search', query],
    queryFn: async () => {
      const url = new URL('https://api.themoviedb.org/3/search/movie')
      url.searchParams.set('query', query)
      url.searchParams.set('language', 'tr-TR')
      const response = await fetch(url, { headers: { Authorization: 'Bearer test-token' } })
      if (!response.ok) throw new Error('Arama yüklenemedi')
      return response.json() as Promise<{ results: { title: string }[] }>
    },
  })
  if (result.status === 'pending') return <p>Aranıyor</p>
  if (result.status === 'error') return <p role="alert">Hata: {result.error.message}</p>
  if (result.data.results.length === 0) return <p>Sonuç yok</p>
  return (
    <ul>
      {result.data.results.map((movie) => (
        <li key={movie.title}>{movie.title}</li>
      ))}
    </ul>
  )
}
