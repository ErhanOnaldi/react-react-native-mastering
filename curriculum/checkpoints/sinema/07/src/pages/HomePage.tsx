import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { MovieGrid } from '../components/MovieGrid'
import { useFavorites } from '../context/FavoritesContext'
import { tmdbFetch } from '../lib/tmdb'
import type { Genre, MovieListResponse } from '../types/tmdb'

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { favoriteIds, toggleFavorite } = useFavorites()
  const genre = searchParams.get('genre') ?? ''
  const requestedPage = Number(searchParams.get('page') ?? '1')
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const [data, setData] = useState<MovieListResponse | null>(null)
  const [genres, setGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    tmdbFetch<{ genres: Genre[] }>('/genre/movie/list')
      .then((result) => {
        if (!ignore) setGenres(result.genres)
      })
      .catch((reason: unknown) => {
        if (!ignore) setError(reason instanceof Error ? reason.message : String(reason))
      })
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError('')
    setData(null)
    const path = genre ? '/discover/movie' : '/trending/movie/week'
    const params = genre ? { with_genres: genre, page } : { page }
    tmdbFetch<MovieListResponse>(path, params)
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
  }, [genre, page])

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

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">
        {genre ? 'Türe göre filmler' : 'Bu haftanın trend filmleri'}
      </h2>
      <label htmlFor="genre-filter">Tür seç</label>
      <select id="genre-filter" value={genre} onChange={(event) => changeGenre(event.target.value)}>
        <option value="">Tüm türler</option>
        {genres.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      {loading && <p role="status">Filmler yükleniyor…</p>}
      {error && <p role="alert">Filmler yüklenemedi: {error}</p>}
      {!loading && !error && data && (
        <>
          <MovieGrid
            movies={data.results}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
          />
          <nav aria-label="Film sayfaları" className="mt-6 flex gap-4">
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
