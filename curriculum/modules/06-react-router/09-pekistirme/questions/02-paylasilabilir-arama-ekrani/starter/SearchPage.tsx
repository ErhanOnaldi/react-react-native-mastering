import { useSearchParams } from 'react-router'

export interface Movie {
  id: number
  title: string
  genre_ids: number[]
}
export function SearchPage({ movies, pageSize = 2 }: { movies: Movie[]; pageSize?: number }) {
  const [params] = useSearchParams()
  return (
    <main>
      <input aria-label="Film ara" defaultValue={params.get('q') ?? ''} />
      <select aria-label="Tür">
        <option value="">Tüm türler</option>
        <option value="28">Aksiyon</option>
      </select>
      <p>Sayfa 1</p>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
      <button type="button">Sonraki sayfa</button>
    </main>
  )
}
