import { expect, expectTypeOf, it } from 'vitest'
import { cardLabel } from '@exercise/task'
import type { Movie, MovieCardData } from '@exercise/task'
it('kart alanları Movie tipinden seçilir; null bilgisi kalır', () => {
  expectTypeOf<MovieCardData>().toEqualTypeOf<Pick<Movie, 'id' | 'title' | 'poster_path'>>()
})
it('poster olmayan filmde bunu etikette belirtir', () => {
  expect(cardLabel({ id: 550, title: 'Dövüş Kulübü', poster_path: null })).toBe(
    'Dövüş Kulübü (poster yok)',
  )
})
it('posteri olan filmde yalnız başlığı gösterir', () => {
  expect(cardLabel({ id: 155, title: 'Kara Şövalye', poster_path: '/poster.jpg' })).toBe(
    'Kara Şövalye',
  )
})
