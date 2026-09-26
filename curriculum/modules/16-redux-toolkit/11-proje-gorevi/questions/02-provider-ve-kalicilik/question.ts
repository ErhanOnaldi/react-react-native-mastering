import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'project',
  title: 'Provider ve kalıcılık bağlantısı',
  difficulty: 'zor',
  concepts: [
    'redux.listener',
    'redux.testing',
    'redux.typed-hooks',
    'perf.rerender',
    'query.useQuery',
  ],
  project: 'sinema',
  focusFiles: [
    'src/app/store.ts',
    'src/main.tsx',
    'src/features/favorites/components/FavoriteButton.tsx',
  ],
  reviewFiles: [
    'src/app/store.ts',
    'src/main.tsx',
    'src/features/favorites/components/FavoriteButton.tsx',
  ],
  rubric: [
    'Provider ağacı ve önceki Query akışı birlikte çalışır.',
    'Kalıcılık reducer dışında listener ile yapılır.',
    'Alakasız selector tüketicilerinin render artışı ölçülür.',
  ],
  hints: [
    'Store’u uygulama ağacına nerede sağlayacağını ve hangi değişimlerin kalıcı yazılması gerektiğini düşün.',
    '`main.tsx` içinde Provider kur. `createListenerMiddleware` ile ilgili action’ları dinleyip reducer sonrası state’i `getState()`ten oku.',
    'Middleware’i `getDefaultMiddleware().prepend(...)` ile ekle. Favori düğmesinde `useAppSelector(state => state.favorites.ids.includes(movieId))` gibi dar seçim yap ve `useAppDispatch` kullan.',
  ],
})
