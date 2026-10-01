import { describe, expect, it } from 'vitest'
import { recentSlice, viewed } from '@exercise/recent'
describe('son bakılanlar', () => {
  it('yeniden bakılan filmi başa taşır ve tekrarı kaldırır', () => {
    const old = { ids: [550, 603, 155] }
    expect(recentSlice.reducer(old, viewed(603)).ids).toEqual([603, 550, 155])
    expect(old.ids).toEqual([550, 603, 155])
  })
  it('yalnız son beş filmi saklar', () => {
    let state = { ids: [] as number[] }
    for (const id of [1, 2, 3, 4, 5, 6]) state = recentSlice.reducer(state, viewed(id))
    expect(state.ids).toEqual([6, 5, 4, 3, 2])
  })
})
