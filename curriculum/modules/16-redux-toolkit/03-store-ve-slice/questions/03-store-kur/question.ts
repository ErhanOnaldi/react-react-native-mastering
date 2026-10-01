import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Store’u birleştir',
  difficulty: 'orta',
  concepts: ['redux.store', 'redux.slice'],
  files: ['store.ts'],
  hints: [
    'Store’un kök state’inde iki özelliğin ayrı anahtarlarda bulunması gerekir; anahtarlar state’te okunan adlarla aynı olmalı.',
    '`configureStore` içindeki `reducer` nesnesinde `favorites` ve `ui` anahtarlarına slice reducer’larını bağla.',
    '`setupStore` her çağrıda `configureStore({ reducer: { favorites: favorites.reducer, ui: ui.reducer } })` döndürsün; action creator’ları da export et.',
  ],
})
