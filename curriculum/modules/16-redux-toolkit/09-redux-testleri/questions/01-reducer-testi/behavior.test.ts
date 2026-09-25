import { describe, expect, it } from 'vitest'
import { listSlice, addMany } from '@exercise/bulk'
describe('watchlist reducer', () => {
  it('birden çok filmi ekler ve tekrarları atlar', () => {
    const next = listSlice.reducer({ ids: [550] }, addMany([550, 603, 603]))
    expect(next.ids).toEqual([550, 603])
  })
  it('önceki state’i değiştirmez', () => {
    const old = { ids: [155] }
    listSlice.reducer(old, addMany([550]))
    expect(old.ids).toEqual([155])
  })
})
