import { describe, expect, it } from 'vitest'
import { add, setupStore, toggle } from '@exercise/store'
describe('store', () => {
  it('favori ve tema slice’larını birlikte taşır', () => {
    const store = setupStore()
    store.dispatch(add(550))
    store.dispatch(toggle())
    expect(store.getState()).toEqual({ favorites: { ids: [550] }, ui: { theme: 'dark' } })
  })
  it('yeni store önceki testin state’ini paylaşmaz', () => {
    const a = setupStore()
    a.dispatch(add(603))
    expect(setupStore().getState().favorites.ids).toEqual([])
  })
})
