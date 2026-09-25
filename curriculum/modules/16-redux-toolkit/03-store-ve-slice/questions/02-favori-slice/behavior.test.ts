import { describe, expect, it } from 'vitest'
import { favoritesSlice, toggleFavorite, selectFavoriteIds } from '@exercise/favorites'
describe('favori slice', () => {
  it('550 kimliğini ekler, ikinci tıklamada çıkarır', () => {
    const first = favoritesSlice.reducer(undefined, toggleFavorite(550))
    expect(first.ids).toEqual([550])
    expect(favoritesSlice.reducer(first, toggleFavorite(550)).ids).toEqual([])
  })
  it('başka favorileri korur ve eski state’i değiştirmez', () => {
    const old = { ids: [550] }
    const next = favoritesSlice.reducer(old, toggleFavorite(603))
    expect(next.ids).toEqual([550, 603])
    expect(old.ids).toEqual([550])
  })
  it('slice selector’ı store kökünden okur', () => {
    expect(selectFavoriteIds({ favorites: { ids: [155] } })).toEqual([155])
  })
})
