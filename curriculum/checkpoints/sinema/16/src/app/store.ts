import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from '@reduxjs/toolkit'
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux'
import { z } from 'zod'
import {
  favoritesSlice,
  toggleFavorite,
} from '@/features/favorites/store/favoritesSlice'
import {
  watchlistsSlice,
  createWatchlist,
  addMovie,
} from '@/features/watchlists/store/watchlistsSlice'
import { uiSlice, setTheme } from '@/features/ui/store/uiSlice'
import {
  recentlyViewedSlice,
  viewMovie,
} from '@/features/recentlyViewed/store/recentlyViewedSlice'

const STORAGE_KEY = 'sinema:client-state'
const savedStateSchema = z.object({
  favorites: z.object({ ids: z.array(z.number()) }),
  watchlists: z.object({
    lists: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        movieIds: z.array(z.number()),
        description: z.string().optional(),
        isPublic: z.boolean().optional(),
        tags: z.array(z.object({ value: z.string() })).optional(),
        createdAt: z.string().optional(),
      }),
    ),
  }),
  ui: z.object({ theme: z.enum(['light', 'dark']) }),
  recentlyViewed: z.object({ ids: z.array(z.number()) }),
})
const rootReducer = combineReducers({
  favorites: favoritesSlice.reducer,
  watchlists: watchlistsSlice.reducer,
  ui: uiSlice.reducer,
  recentlyViewed: recentlyViewedSlice.reducer,
})
type ClientState = ReturnType<typeof rootReducer>

function readSavedState(): ClientState | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = savedStateSchema.safeParse(JSON.parse(raw))
      return parsed.success ? parsed.data : undefined
    }
    // 15. checkpoint'teki kullanıcı verisini ilk açılışta taşı.
    const favorites = JSON.parse(
      localStorage.getItem('sinema-favorites') || '[]',
    ) as unknown
    const watchlists = JSON.parse(
      localStorage.getItem('sinema:watchlists') || '[]',
    ) as unknown
    const previous = savedStateSchema.safeParse({
      favorites: { ids: favorites },
      watchlists: {
        lists: Array.isArray(watchlists)
          ? watchlists.map((list: Record<string, unknown>) => ({
              ...list,
              movieIds: [],
            }))
          : [],
      },
      ui: { theme: 'dark' },
      recentlyViewed: { ids: [] },
    })
    return previous.success ? previous.data : undefined
  } catch {
    return undefined
  }
}

export function setupStore(preloadedState?: Partial<ClientState>) {
  const listener = createListenerMiddleware()
  const initial = preloadedState ?? readSavedState()
  const created = configureStore({
    reducer: rootReducer,
    preloadedState: initial
      ? { ...rootReducer(undefined, { type: '@@INIT' }), ...initial }
      : undefined,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listener.middleware),
  })
  listener.startListening({
    matcher: isAnyOf(
      toggleFavorite,
      createWatchlist,
      addMovie,
      setTheme,
      viewMovie,
    ),
    effect: (_action, api) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(api.getState()))
      } catch {
        /* Storage kapalı olabilir. */
      }
    },
  })
  return created
}
export const store = setupStore()
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
