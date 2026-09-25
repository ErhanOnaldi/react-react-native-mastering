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
    'Önce `main.tsx` içinde uygulamayı Redux Provider ile sar.',
    'Listener middleware’i `getDefaultMiddleware().prepend(...)` ile ekle ve güncel state’i `getState()`ten oku.',
    'Favori düğmesinde yalnız `ids.includes(movieId)` boolean değerini seç; tema action’ıyla render artışını ölç.',
  ],
})
