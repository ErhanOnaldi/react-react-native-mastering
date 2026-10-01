import { describe, expect, it } from 'vitest'
import { selectOverlap, type State } from '@exercise/overlap'
describe('favori ve liste kesişimi', () => {
  const state: State = { favorites: { ids: [550, 155] }, watchlists: { selectedIds: [603, 550] } }
  it('yalnız listedeki favori ID’lerini listedeki sırayla verir', () => {
    expect(selectOverlap(state)).toEqual([550])
  })
  it('girdiler aynıysa aynı sonuç referansını döndürür', () => {
    expect(selectOverlap(state)).toBe(selectOverlap(state))
  })
  it('favoriler değişince sonucu yeniden hesaplar', () => {
    expect(selectOverlap({ ...state, favorites: { ids: [603] } })).toEqual([603])
  })
})
