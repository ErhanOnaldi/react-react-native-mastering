import { describe, expect, it, vi } from 'vitest'
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
  it('storage yazımı başarısız olsa da dispatch tamamlanır', () => {
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage kapalı')
    })
    const store = setupStore()
    expect(() => store.dispatch(toggle(550))).not.toThrow()
    expect(store.getState().favorites.ids).toEqual([550])
    write.mockRestore()
  })
})
