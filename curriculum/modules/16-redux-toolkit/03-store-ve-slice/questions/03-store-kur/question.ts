import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Store’u birleştir',
  difficulty: 'orta',
  concepts: ['redux.store', 'redux.slice'],
  files: ['store.ts'],
  hints: [
    'Store’un reducer alanına bak.',
    '`combineSlices` birden fazla slice alır.',
    '`combineSlices(favorites, ui)` iki ayrı anahtar üretir.',
  ],
})
