import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
function Results({ query }: { query: string }) {
  const result = useQuery({
    queryKey: ['movies', 'search', query.trim()],
    queryFn: async (): Promise<{ results: { id: number; title: string }[] }> => {
      const url = new URL('https://api.themoviedb.org/3/search/movie')
      url.searchParams.set('query', query.trim())
      url.searchParams.set('language', 'tr-TR')
      const response = await fetch(url, { headers: { Authorization: 'Bearer test-token' } })
      if (!response.ok) throw new Error('Arama yüklenemedi')
      return response.json()
    },
    staleTime: 60_000,
  })
  if (result.isPending) return <p>Yükleniyor</p>
  if (result.isError) return <p role="alert">Arama yüklenemedi</p>
  return (
    <ul>
      {result.data.results.map((movie) => (
        <li key={movie.id}>{movie.title}</li>
      ))}
    </ul>
  )
}
export function SearchAgain({ query }: { query: string }) {
  const [details, setDetails] = useState(false)
  return (
    <div>
      <button onClick={() => setDetails(!details)}>{details ? 'Geri' : 'Detay'}</button>
      {details ? <p>Detay sayfası</p> : <Results query={query} />}
    </div>
  )
}
