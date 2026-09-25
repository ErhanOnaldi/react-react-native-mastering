import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Bilinen puanı cache’e yaz',
  difficulty: 'orta',
  concepts: ['query.invalidation', 'react.immutability', 'js.array-methods'],
  files: ['patchRating.ts'],
  hints: [
    'setQueryData’ye updater fonksiyonu ver.',
    'old?.map ile yeni dizi üret; seçili öğeyi spread ile kopyala.',
    'old undefined ise undefined döndür.',
  ],
})
