import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import { movieQueries } from '@/features/movies/api/movie-queries'
import { MovieGrid } from '@/features/movies/components/MovieGrid'
import { SearchBox } from '@/features/search/components/SearchBox'
import { useDebounce } from '@/hooks/useDebounce'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const debouncedQuery = useDebounce(query, 350).trim()
  const requestedPage = Number(searchParams.get('page') ?? '1')
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const search = useQuery({
    ...movieQueries.search({ query: debouncedQuery, page }),
    enabled: Boolean(debouncedQuery),
    placeholderData: keepPreviousData,
  })

  function changeQuery(value: string) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (value) next.set('q', value)
      else next.delete('q')
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

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">Film ara</h2>
      <SearchBox value={query} onChange={changeQuery} />
      {!query.trim() && <p role="status">Aramak için bir film adı yaz.</p>}
      {query.trim() && search.isPending && <p role="status">Aranıyor…</p>}
      {search.isError && (
        <p role="alert">Arama başarısız: {search.error.message}</p>
      )}
      {query.trim() && search.isSuccess && (
        <>
          <MovieGrid movies={search.data.results} />
          <nav aria-label="Arama sayfaları" className="mt-6 flex gap-4">
            {page > 1 && (
              <button type="button" onClick={() => changePage(page - 1)}>
                Önceki
              </button>
            )}
            <span>
              Sayfa {search.data.page} / {search.data.total_pages}
            </span>
            {page < search.data.total_pages && (
              <button type="button" onClick={() => changePage(page + 1)}>
                Sonraki
              </button>
            )}
            {search.isPlaceholderData && (
              <span role="status">Yeni sayfa yükleniyor…</span>
            )}
          </nav>
        </>
      )}
    </>
  )
}
