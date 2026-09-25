import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama state’ini taşı',
  difficulty: 'kolay',
  concepts: ['react.lifting-state', 'react.controlled-input', 'js.array-methods'],
  files: ['SearchableMovies.tsx'],
  hints: [
    'Arama kutusu ve liste aynı sorguyu kullanmalı.',
    'Query state’ini ortak üst bileşende tut; görünür listeyi `filter` ile türet.',
    "`title.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr').trim())` ile filtrele; boşta mesaj göster.",
  ],
})
