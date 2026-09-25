import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Favori kuralını slice’a taşı',
  difficulty: 'orta',
  concepts: ['redux.slice', 'react.immutability'],
  files: ['favorites.ts'],
  hints: [
    'ID’nin dizideki yerini `indexOf` ile ara.',
    'Bulunmadıysa `push`, bulunduysa `splice` kullan.',
    '`state.ids.splice(index, 1)` yalnız bulunan ID’yi çıkarır.',
  ],
})
