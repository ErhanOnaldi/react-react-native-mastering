import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Son bakılanları sırala',
  difficulty: 'orta',
  concepts: ['redux.slice', 'react.immutability'],
  files: ['recent.ts'],
  hints: [
    'Yeni kayıt başa gelmeli, eskisinin kopyası kalmamalı ve liste üst sınırı beş olmalı.',
    'Immer draft üzerinde aynı ID’yi `filter` ile çıkar, `unshift` ile ekle, `slice(0, 5)` ile sınırla.',
    '`state.ids = state.ids.filter(...); state.ids.unshift(id); state.ids = state.ids.slice(0, 5)` sırası yeterli.',
  ],
})
