import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Bilinmeyen film özetini kontrol et',
  difficulty: 'orta',
  concepts: ['ts.type-guards', 'ts.unknown-any', 'ts.narrowing'],
  files: ['task.ts'],
  hints: [
    'Önce nesne mi ve null değil mi kontrol et.',
    '`in` ile alanları daralt, sonra typeof uygula.',
    'poster_path için string veya null kabul et.',
  ],
})
