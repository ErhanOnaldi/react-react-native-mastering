import { useSearchParams } from 'react-router'

export interface Movie {
  id: number
  title: string
  genre_ids: number[]
}
export function SearchPage({ movies, pageSize = 2 }: { movies: Movie[]; pageSize?: number }) {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const genre = params.get('genre') ?? ''
  const rawPage = Number(params.get('page') ?? '1')
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1
  const filtered = movies.filter(
    (movie) =>
      movie.title.toLocaleLowerCase('tr-TR').includes(q.trim().toLocaleLowerCase('tr-TR')) &&
      (!genre || movie.genre_ids.includes(Number(genre))),
  )
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)
  function changeFilter(key: 'q' | 'genre', value: string) {
    setParams((previous) => {
      const next = new URLSearchParams(previous)
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete('page')
      return next
    })
  }
  return (
    <main>
      <input
        aria-label="Film ara"
        value={q}
        onChange={(event) => changeFilter('q', event.target.value)}
      />
      <select
        aria-label="Tür"
        value={genre}
        onChange={(event) => changeFilter('genre', event.target.value)}
      >
        <option value="">Tüm türler</option>
        <option value="28">Aksiyon</option>
      </select>
      <p>Sayfa {page}</p>
      {visible.length === 0 ? (
        <p>Film bulunamadı</p>
      ) : (
        <ul>
          {visible.map((movie) => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={() =>
          setParams((previous) => {
            const next = new URLSearchParams(previous)
            next.set('page', String(page + 1))
            return next
          })
        }
      >
        Sonraki sayfa
      </button>
    </main>
  )
}
