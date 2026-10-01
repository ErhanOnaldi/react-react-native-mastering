import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Reducer testi yaz: tekrarları atla',
  difficulty: 'orta',
  concepts: ['redux.testing', 'test.vitest-basics', 'react.immutability'],
  files: ['bulk.test.ts'],
  hints: [
    'Bir başlangıç listesi ve payload seç; beklenen yeni listeyi elle çıkar.',
    'Vitest’te reducer’ı doğrudan çağırıp state sonucunu `toEqual` ile karşılaştır.',
    'Ayrı bir testte payload tekrarını ve eski state’in değişmediğini doğrula.',
  ],
  testWriting: {
    mutants: [
      { id: 'keeps-payload-duplicates', label: 'payload içindeki tekrarları ekleyen sürüm' },
      { id: 'changes-existing-order', label: 'önceki ID sırasını değiştiren sürüm' },
    ],
  },
})
