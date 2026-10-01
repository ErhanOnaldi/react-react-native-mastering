import { expect, expectTypeOf, it } from 'vitest'
import { firstResult } from '@exercise/task'
import type { GenreListResponse, MovieListResponse, Paginated } from '@exercise/task'

it('film ve tür sayfaları aynı alanları kullanır', () => {
  expectTypeOf<MovieListResponse>().toEqualTypeOf<Paginated<Movie>>()
  expectTypeOf<GenreListResponse>().toEqualTypeOf<Paginated<Genre>>()
})

it('ilk filmi döndürür ve film alanlarını korur', () => {
  const response: MovieListResponse = {
    page: 1,
    results: [{ id: 550, title: 'Dövüş Kulübü' }],
    total_pages: 4,
    total_results: 61,
  }

  expect(firstResult(response)).toEqual({ id: 550, title: 'Dövüş Kulübü' })
  expectTypeOf(firstResult(response)).toEqualTypeOf<Movie | undefined>()
})

it('boş tür sayfasında undefined döndürür', () => {
  const response: GenreListResponse = {
    page: 1,
    results: [],
    total_pages: 0,
    total_results: 0,
  }

  expect(firstResult(response)).toBeUndefined()
})

type Movie = { id: number; title: string }
type Genre = { id: number; name: string }
