import { describe, expect, expectTypeOf, it } from 'vitest'
import { firstResult } from '@exercise/task'
import type { GenreListResponse, MovieListResponse, Paginated } from '@exercise/task'
describe('generic sayfalama', () => {
  it('liste ve tür cevapları aynı kabuğu farklı öğelerle kullanır', () => {
    expectTypeOf<MovieListResponse>().toEqualTypeOf<Paginated<{ id: number; title: string }>>()
    expectTypeOf<GenreListResponse>().toEqualTypeOf<Paginated<{ id: number; name: string }>>()
  })
  it('ilk filmi döndürür', () => {
    expect(
      firstResult({
        page: 1,
        results: [{ id: 550, title: 'Dövüş Kulübü' }],
        total_pages: 1,
        total_results: 1,
      }),
    ).toEqual({ id: 550, title: 'Dövüş Kulübü' })
  })
  it('boş sayfada undefined döndürür', () => {
    expect(
      firstResult({ page: 1, results: [] as number[], total_pages: 0, total_results: 0 }),
    ).toBeUndefined()
  })
  it('öğe tipini dönüşe taşır', () => {
    expectTypeOf(
      firstResult({
        page: 1,
        results: [{ id: 18, name: 'Dram' }],
        total_pages: 1,
        total_results: 1,
      }),
    ).toEqualTypeOf<{ id: number; name: string } | undefined>()
  })
})
