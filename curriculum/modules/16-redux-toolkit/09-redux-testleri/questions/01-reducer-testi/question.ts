import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Reducer kuralı: toplu ekleme',
  difficulty: 'orta',
  concepts: ['redux.testing', 'test.vitest-basics', 'react.immutability'],
  files: ['bulk.ts'],
  hints: [
    'Reducer’a eski ID dizisi ve payload gelir.',
    'Her ID için `includes` kontrolü yap.',
    'Yalnız yoksa `state.ids.push(id)` kullan.',
  ],
})
