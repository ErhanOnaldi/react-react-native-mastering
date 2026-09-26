import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import { movieQueries } from '@/features/movies/api/movie-queries'
import { MovieGrid } from '@/features/movies/components/MovieGrid'

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawGenre = searchParams.get('genre') ?? ''
  const genreId = Number(rawGenre)
  const genre =
    rawGenre && Number.isSafeInteger(genreId) && genreId > 0 ? rawGenre : ''
  const requestedPage = Number(searchParams.get('page') ?? '1')
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1

  const genres = useQuery(movieQueries.genres())
  const discover = useQuery({
    ...movieQueries.discover({ genreId, page }),
    enabled: Boolean(genre),
    placeholderData: keepPreviousData,
  })
  const trending = useInfiniteQuery({
    ...movieQueries.trendingInfinite(),
    enabled: !genre,
  })

  function changeGenre(value: string) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (value) next.set('genre', value)
      else next.delete('genre')
      next.delete('page')
      return next
    })
  }

  function changePage(nextPage: number) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.set('page', String(nextPage))
      return next
    })
  }

  const active = genre ? discover : trending
  const movies = genre
    ? (discover.data?.results ?? [])
    : (trending.data?.pages.flatMap((result) => result.results) ?? [])

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">
        {genre ? 'Türe göre filmler' : 'Bu haftanın trend filmleri'}
      </h2>
      <label htmlFor="genre-filter">Tür seç</label>
      <select
        id="genre-filter"
        value={genre}
        onChange={(event) => changeGenre(event.target.value)}
      >
        <option value="">Tüm türler</option>
        {genres.data?.genres.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      {genres.isError && (
        <p role="alert">Türler yüklenemedi: {genres.error.message}</p>
      )}
      {active.isPending && <p role="status">Filmler yükleniyor…</p>}
      {active.isError && (
        <p role="alert">Filmler yüklenemedi: {active.error.message}</p>
      )}
      {active.isSuccess && (
        <>
          <MovieGrid movies={movies} />
          {genre ? (
            <nav aria-label="Film sayfaları" className="mt-6 flex gap-4">
              {page > 1 && (
                <button type="button" onClick={() => changePage(page - 1)}>
                  Önceki
                </button>
              )}
              <span>
                Sayfa {discover.data?.page} / {discover.data?.total_pages}
              </span>
              {page < (discover.data?.total_pages ?? 0) && (
                <button type="button" onClick={() => changePage(page + 1)}>
                  Sonraki
                </button>
              )}
              {discover.isPlaceholderData && (
                <span role="status">Yeni sayfa yükleniyor…</span>
              )}
            </nav>
          ) : (
            trending.hasNextPage && (
              <button
                type="button"
                className="mt-6"
                onClick={() => trending.fetchNextPage()}
                disabled={trending.isFetchingNextPage}
              >
                {trending.isFetchingNextPage ? 'Yükleniyor…' : 'Daha fazla'}
              </button>
            )
          )}
        </>
      )}
    </>
  )
}
