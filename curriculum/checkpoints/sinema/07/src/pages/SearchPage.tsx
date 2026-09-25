import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { MovieGrid } from '../components/MovieGrid'
import { SearchBox } from '../components/SearchBox'
import { useFavorites } from '../context/FavoritesContext'
import { useDebounce } from '../hooks/useDebounce'
import { tmdbFetch } from '../lib/tmdb'
import type { MovieListResponse } from '../types/tmdb'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { favoriteIds, toggleFavorite } = useFavorites()
  const query = searchParams.get('q') ?? ''
  const debouncedQuery = useDebounce(query, 350)
  const requestedPage = Number(searchParams.get('page') ?? '1')
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const [data, setData] = useState<MovieListResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setData(null)
      setLoading(false)
      setError('')
      return
    }
    let ignore = false
    setLoading(true)
    setError('')
    setData(null)
    tmdbFetch<MovieListResponse>('/search/movie', { query: debouncedQuery.trim(), page })
      .then((result) => {
        if (!ignore) setData(result)
      })
      .catch((reason: unknown) => {
        if (!ignore) setError(reason instanceof Error ? reason.message : String(reason))
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [debouncedQuery, page])

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
      {loading && <p role="status">Aranıyor…</p>}
      {error && <p role="alert">Arama başarısız: {error}</p>}
      {!loading && !error && data && (
        <>
          <MovieGrid
            movies={data.results}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
          />
          <nav aria-label="Arama sayfaları" className="mt-6 flex gap-4">
            {page > 1 && (
              <button type="button" onClick={() => changePage(page - 1)}>
                Önceki
              </button>
            )}
            <span>
              Sayfa {data.page} / {data.total_pages}
            </span>
            {page < data.total_pages && (
              <button type="button" onClick={() => changePage(page + 1)}>
                Sonraki
              </button>
            )}
          </nav>
        </>
      )}
    </>
  )
}
