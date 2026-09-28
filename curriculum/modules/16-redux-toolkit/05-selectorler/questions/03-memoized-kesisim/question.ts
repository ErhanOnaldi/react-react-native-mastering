import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Memoized favori kesişimi',
  difficulty: 'orta',
  concepts: ['redux.selectors', 'js.array-methods'],
  files: ['overlap.ts'],
  hints: [
    'Çıktıdaki sıra hangi listeden gelmeli? İki kaynak diziyi ayır.',
    '`createSelector` result fonksiyonunda bir dizinin elemanlarını diğerinde arayabilirsin.',
    '`selected.filter(id => favorites.includes(id))` seçili listenin sırasını korur.',
  ],
})
