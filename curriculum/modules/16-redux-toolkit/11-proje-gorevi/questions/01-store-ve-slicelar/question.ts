import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'project',
  title: 'Sinema client state’ini slice’lara taşı',
  difficulty: 'zor',
  concepts: [
    'redux.store',
    'redux.slice',
    'redux.typed-hooks',
    'redux.server-vs-client',
    'react.context',
    'arch.state-categories',
  ],
  project: 'sinema',
  focusFiles: [
    'src/app/store.ts',
    'src/features/favorites/store/favoritesSlice.ts',
    'src/features/watchlists/store/watchlistsSlice.ts',
    'src/features/ui/store/uiSlice.ts',
    'src/features/recentlyViewed/store/recentlyViewedSlice.ts',
  ],
  reviewFiles: [
    'src/app/store.ts',
    'src/features/favorites/store/favoritesSlice.ts',
    'src/features/watchlists/store/watchlistsSlice.ts',
    'src/features/ui/store/uiSlice.ts',
    'src/features/recentlyViewed/store/recentlyViewedSlice.ts',
  ],
  rubric: [
    'TMDB detay nesneleri Redux state’ine kopyalanmaz.',
    'Reducer’lar saf kalır ve yinelenen ID üretmez.',
    'Tipli hook’lar ve store export’ları sözleşmeye uyar.',
  ],
  hints: [
    'Önce var olan FavoritesContext ve useWatchlists davranışını çıkar; ID’leri sakla, TMDB nesnelerini değil.',
    'Her özellik için `createSlice` kur, `combineSlices` ile birleştir.',
    '`RootState` ve `AppDispatch` tiplerini store’dan türet; hook’ları `.withTypes` ile dışa ver.',
  ],
})
