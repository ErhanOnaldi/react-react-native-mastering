import { expect, expectTypeOf, it } from 'vitest'
import { getField } from '@exercise/task'
it('film başlığını seçer ve string tipini korur', () => {
  const title = getField({ id: 550, title: 'Dövüş Kulübü' }, 'title')
  expect(title).toBe('Dövüş Kulübü')
  expectTypeOf(title).toEqualTypeOf<string>()
})
it('farklı nesnede sayı ve dizi alanlarını seçer', () => {
  const ids = getField({ genre_ids: [18, 53], count: 2 }, 'genre_ids')
  expect(ids).toEqual([18, 53])
  expectTypeOf(ids).toEqualTypeOf<number[]>()
})
