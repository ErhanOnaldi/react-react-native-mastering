import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Reducer kuralı: toplu ekleme',
  difficulty: 'orta',
  concepts: ['redux.testing', 'test.vitest-basics', 'react.immutability'],
  files: ['bulk.ts'],
  hints: [
    'Başlangıç listesindeki ve payload’ın kendi içindeki tekrarlar eklenmemeli.',
    'Her yeni kimlikten önce `includes` ile mevcut draft listesini kontrol et.',
    'Yalnız bulunmayan ID için `state.ids.push(id)` çağır.',
  ],
})
