import { describe, expect, it } from 'vitest'
import { setupStore } from '@project/src/app/store'
import { toggleFavorite } from '@project/src/features/favorites/store/favoritesSlice'
import { setTheme } from '@project/src/features/ui/store/uiSlice'
describe('Sinema kalıcılığı', () => {
  it('favori ve tema değişimini reducer sonrası client state olarak yazar', () => {
    localStorage.clear()
    const store = setupStore()
    store.dispatch(toggleFavorite(550))
    store.dispatch(setTheme('dark'))
    const saved = JSON.parse(localStorage.getItem('sinema:client-state') || 'null')
    expect(saved.favorites.ids).toContain(550)
    expect(saved.ui.theme).toBe('dark')
  })
  it('bozuk storage kaydında varsayılan state ile açılır', () => {
    localStorage.setItem('sinema:client-state', '{bozuk')
    const store = setupStore()
    expect(store.getState().favorites.ids).toEqual([])
  })
})
