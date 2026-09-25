import { expect, expectTypeOf, it } from 'vitest'
import { SORT_FIELDS, isSortField, sortLabel } from '@exercise/task'
import type { SortField } from '@exercise/task'
it('izin verilen değerleri diziden literal union olarak türetir', () => {
  expectTypeOf<SortField>().toEqualTypeOf<'popularity' | 'vote_average' | 'release_date'>()
  expect(SORT_FIELDS).toEqual(['popularity', 'vote_average', 'release_date'])
})
it('geçerli sıralama alanlarını ayırt eder', () => {
  expect(isSortField('vote_average')).toBe(true)
  expect(isSortField('vote_avrage')).toBe(false)
})
it('her alanın Türkçe etiketini verir', () => {
  expect(sortLabel('popularity')).toBe('Popülerlik')
  expect(sortLabel('release_date')).toBe('Vizyon tarihi')
})
