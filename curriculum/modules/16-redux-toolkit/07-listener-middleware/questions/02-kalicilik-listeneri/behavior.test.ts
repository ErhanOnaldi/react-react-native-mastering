import { describe, expect, it } from 'vitest'
import { setupStore, toggle } from '@exercise/persist'
describe('kalıcılık listener’ı', () => {
  it('reducer sonrası favori ID’lerini localStorage’a yazar', () => {
    localStorage.clear()
    const store = setupStore()
    store.dispatch(toggle(550))
    expect(JSON.parse(localStorage.getItem('sinema:favorites') || 'null')).toEqual([550])
    store.dispatch(toggle(603))
    expect(JSON.parse(localStorage.getItem('sinema:favorites') || 'null')).toEqual([550, 603])
  })
  it('favori çıkarınca yeni state’i yazar', () => {
    localStorage.clear()
    const store = setupStore()
    store.dispatch(toggle(550))
    store.dispatch(toggle(550))
    expect(JSON.parse(localStorage.getItem('sinema:favorites') || 'null')).toEqual([])
  })
})
