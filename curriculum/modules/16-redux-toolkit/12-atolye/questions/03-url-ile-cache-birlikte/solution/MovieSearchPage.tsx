import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'

type Movie = { id: number; title: string }

export function MovieSearchPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const page = Math.max(1, Number(params.get('page') ?? '1') || 1)

  const result = useQuery({
    queryKey: ['movies', 'search', query, page],
    enabled: query.trim().length > 0,
    queryFn: async (): Promise<{ results: Movie[] }> => {
      const url = new URL('https://api.themoviedb.org/3/search/movie')
      url.searchParams.set('query', query)
      url.searchParams.set('page', String(page))
      url.searchParams.set('language', 'tr-TR')
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
      })
      if (!response.ok) throw new Error('Arama başarısız')
      return response.json() as Promise<{ results: Movie[] }>
    },
    staleTime: 60_000,
  })

  return (
    <main>
      <label>
        Arama
        <input
          aria-label="Arama"
          value={query}
          onChange={(event) => setParams({ q: event.target.value, page: '1' })}
        />
      </label>
      <button
        onClick={() => setParams({ q: query, page: String(Math.max(1, page - 1)) })}
        disabled={page === 1}
      >
        Önceki sayfa
      </button>
      <button onClick={() => setParams({ q: query, page: String(page + 1) })}>Sonraki sayfa</button>
      {result.isPending && query.trim() && <p>Yükleniyor</p>}
      {result.isError && <p role="alert">Arama başarısız</p>}
      {result.isSuccess && (
        <ul>
          {result.data.results.map((movie) => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      )}
    </main>
  )
}
