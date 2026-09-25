import '@project/src/types/tmdb'
import { catalog } from '@test-utils'
import { describe, expect, expectTypeOf, it } from 'vitest'
import type { Movie, MovieListResponse } from '@project/src/types/tmdb'

describe('Sinema TMDB tipleri', () => {
  it('gerçek TMDB liste öğesini Movie olarak kabul eder', () => {
    const movie: Movie = catalog.find((item) => item.id === 550)!
    expect(movie.title).toBe('Dövüş Kulübü')
    expect(movie.release_date).toBe('1999-10-15')
  })

  it('nullable poster ve dizi alanlarını doğru tipler', () => {
    expectTypeOf<Movie['poster_path']>().toEqualTypeOf<string | null>()
    expectTypeOf<Movie['backdrop_path']>().toEqualTypeOf<string | null>()
    expectTypeOf<Movie['genre_ids']>().toEqualTypeOf<number[]>()
    expectTypeOf<Movie>().toEqualTypeOf<{
      id: number
      title: string
      original_title: string
      overview: string
      poster_path: string | null
      backdrop_path: string | null
      release_date: string
      genre_ids: number[]
      vote_average: number
      vote_count: number
      popularity: number
      adult: boolean
      original_language: string
      video: boolean
    }>()
  })

  it('liste cevabında sayfa ve Movie sonuçları taşır', () => {
    expectTypeOf<MovieListResponse>().toEqualTypeOf<{
      page: number
      results: Movie[]
      total_pages: number
      total_results: number
    }>()
  })
})
