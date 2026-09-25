import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Önce filtrele, sonra sayfala',
  difficulty: 'orta',
  concepts: ['router.search-params', 'js.array-methods', 'react.derived-state'],
  files: ['selectMovies.ts'],
  hints: [
    'Önce `filter`, sonra `slice` düşün.',
    '`slice((page - 1) * pageSize, page * pageSize)` kullan; q ve genre koşullarını aynı filter içinde birleştir.',
  ],
})
