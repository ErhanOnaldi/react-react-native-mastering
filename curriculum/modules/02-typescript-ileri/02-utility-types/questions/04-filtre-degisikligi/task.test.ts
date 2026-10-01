import { describe, expect, expectTypeOf, it } from 'vitest'
import { applyFilterChange } from '@exercise/task'
import type { DiscoverFilters, FilterChange, SortBy } from '@exercise/task'

const onPageFive: DiscoverFilters = {
  genreId: 18,
  year: 1999,
  sortBy: 'popularity.desc',
  page: 5,
}

describe('filtre değişikliği', () => {
  it('değişiklik nesnesi sayfa dışındaki alanları isteğe bağlı taşır', () => {
    expectTypeOf<FilterChange>().toEqualTypeOf<{
      genreId?: number | null
      year?: number | null
      sortBy?: SortBy
    }>()
  })

  it('sayfa numarası filtre değişikliğiyle gönderilemez', () => {
    const tryPage = () =>
      // @ts-expect-error — sayfa filtre panelinden değişmez
      applyFilterChange(onPageFive, { page: 3 })
    expect(typeof tryPage).toBe('function')
  })

  it('yalnızca değişen alanı günceller, diğerlerini korur', () => {
    expect(applyFilterChange(onPageFive, { year: 2008 })).toEqual({
      genreId: 18,
      year: 2008,
      sortBy: 'popularity.desc',
      page: 1,
    })
  })

  it('herhangi bir filtre değişince ilk sayfaya döner', () => {
    expect(applyFilterChange(onPageFive, { sortBy: 'vote_average.desc' }).page).toBe(1)
  })

  it('null gönderilen filtreyi kaldırır, hiç gönderilmeyene dokunmaz', () => {
    expect(applyFilterChange(onPageFive, { genreId: null })).toEqual({
      genreId: null,
      year: 1999,
      sortBy: 'popularity.desc',
      page: 1,
    })
  })

  it('mevcut filtre nesnesini değiştirmez', () => {
    applyFilterChange(onPageFive, { year: 2008 })
    expect(onPageFive).toEqual({ genreId: 18, year: 1999, sortBy: 'popularity.desc', page: 5 })
  })
})
