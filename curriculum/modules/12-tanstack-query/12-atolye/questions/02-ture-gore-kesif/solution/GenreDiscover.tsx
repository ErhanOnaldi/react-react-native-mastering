import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'

type Movie = { id: number; title: string }
export function GenreDiscover() {
  const [params, setParams] = useSearchParams()
  const genre = params.get('genre') === '35' ? '35' : '28'
  const page = Math.max(1, Number(params.get('page') ?? '1') || 1)
  const result = useQuery({
    queryKey: ['movies', 'discover', genre, page],
    queryFn: async (): Promise<{ results: Movie[] }> => {
      const url = new URL('https://api.themoviedb.org/3/discover/movie')
      url.searchParams.set('with_genres', genre)
      url.searchParams.set('page', String(page))
      url.searchParams.set('language', 'tr-TR')
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
      })
      if (!response.ok) throw new Error('Keşif yüklenemedi')
      return response.json()
    },
    staleTime: 60_000,
  })
  return (
    <section>
      <label>
        Tür{' '}
        <select
          value={genre}
          onChange={(event) => setParams({ genre: event.target.value, page: '1' })}
        >
          <option value="28">Aksiyon</option>
          <option value="35">Komedi</option>
        </select>
      </label>
      <button disabled={page === 1} onClick={() => setParams({ genre, page: String(page - 1) })}>
        Önceki sayfa
      </button>
      <button onClick={() => setParams({ genre, page: String(page + 1) })}>Sonraki sayfa</button>
      <p>Sayfa {page}</p>
      {result.isPending && <p>Yükleniyor</p>}
      {result.isError && <p role="alert">Keşif yüklenemedi</p>}
      {result.isSuccess && (
        <ul>
          {result.data.results.map((movie) => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
