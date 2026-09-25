import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Memoized favori kesişimi',
  difficulty: 'orta',
  concepts: ['redux.selectors', 'js.array-methods'],
  files: ['overlap.ts'],
  hints: [
    'İki input selector zaten hazır.',
    'Result fonksiyonunda `filter` kullan.',
    '`selected.filter(id => favorites.includes(id))` sırayı korur.',
  ],
})
