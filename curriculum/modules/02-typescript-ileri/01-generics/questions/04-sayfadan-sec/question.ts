import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sayfadan ID ile seç',
  difficulty: 'orta',
  concepts: ['ts.generics', 'ts.generic-constraints', 'ts.api-types'],
  files: ['task.ts'],
  hints: [
    'Sayfalama kabuğunun yalnız `results` dizisinde arama yapması gerektiğini belirle.',
    '`T extends { id: number }` kısıtını sayfa içindeki öğeye uygula.',
    '`page.results.find(...)` eşleşen `T` değerini veya `undefined` verir.',
  ],
})
