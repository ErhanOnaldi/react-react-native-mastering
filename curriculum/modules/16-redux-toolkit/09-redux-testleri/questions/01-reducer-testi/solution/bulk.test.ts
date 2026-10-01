import { describe, expect, it } from 'vitest'
import { addMany, listSlice } from '@impl/bulk'

describe('watchlist reducer', () => {
  it('yeni ID’leri sırayla ekler ve mevcut ID’yi atlar', () => {
    const next = listSlice.reducer({ ids: [550] }, addMany([550, 603]))
    expect(next.ids).toEqual([550, 603])
  })

  it('payload içindeki tekrarı eklemez', () => {
    const next = listSlice.reducer({ ids: [] }, addMany([603, 603]))
    expect(next.ids).toEqual([603])
  })

  it('önceki state’i değiştirmez', () => {
    const previous = { ids: [155] }
    listSlice.reducer(previous, addMany([550]))
    expect(previous.ids).toEqual([155])
  })
})
