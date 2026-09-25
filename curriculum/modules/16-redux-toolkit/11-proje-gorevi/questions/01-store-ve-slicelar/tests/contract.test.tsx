import { describe, expect, it } from 'vitest'
import { setupStore } from '@project/src/app/store'
import { toggleFavorite } from '@project/src/features/favorites/store/favoritesSlice'
import { createWatchlist, addMovie } from '@project/src/features/watchlists/store/watchlistsSlice'
import { setTheme } from '@project/src/features/ui/store/uiSlice'
import { viewMovie } from '@project/src/features/recentlyViewed/store/recentlyViewedSlice'
describe('Sinema Redux client state sözleşmesi', () => {
  it('favorileri ekler, çıkarır; TMDB nesnesi kopyalamaz', () => {
    const store = setupStore()
    store.dispatch(toggleFavorite(550))
    store.dispatch(toggleFavorite(603))
    store.dispatch(toggleFavorite(550))
    expect(store.getState().favorites.ids).toEqual([603])
  })
  it('watchlist oluşturur ve filmi yalnız bir kez ekler', () => {
    const store = setupStore()
    store.dispatch(createWatchlist({ id: 'hafta-sonu', name: 'Hafta sonu' }))
    store.dispatch(addMovie({ listId: 'hafta-sonu', movieId: 550 }))
    store.dispatch(addMovie({ listId: 'hafta-sonu', movieId: 550 }))
    expect(store.getState().watchlists.lists).toEqual([
      { id: 'hafta-sonu', name: 'Hafta sonu', movieIds: [550] },
    ])
  })
  it('tema ve son bakılanları bağımsız tutar', () => {
    const store = setupStore()
    store.dispatch(setTheme('dark'))
    for (const id of [1, 2, 3, 4, 5, 6, 3]) store.dispatch(viewMovie(id))
    expect(store.getState().ui.theme).toBe('dark')
    expect(store.getState().recentlyViewed.ids).toEqual([3, 6, 5, 4, 2])
  })
})
