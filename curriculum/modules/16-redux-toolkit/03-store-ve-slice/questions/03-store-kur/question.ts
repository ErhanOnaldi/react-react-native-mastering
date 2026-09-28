import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Store’u birleştir',
  difficulty: 'orta',
  concepts: ['redux.store', 'redux.slice'],
  files: ['store.ts'],
  hints: [
    'Store’un kök state’inde iki özelliğin ayrı anahtarlarda bulunması gerekir.',
    '`combineSlices` ile birden fazla slice reducer’ını tek kök reducer’da birleştir.',
    '`combineSlices(favorites, ui)` sonucunu `configureStore` içindeki `reducer` alanına ver.',
  ],
})
