import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Filtrelenmiş listeyi türet',
  difficulty: 'orta',
  concepts: ['react.derived-state', 'react.controlled-input', 'js.array-methods'],
  files: ['MovieFilter.tsx'],
  hints: [
    '`visible` için ayrı state gerekmiyor.',
    'Her render’da props’tan `filter` ile üret.',
    '`useEffect` ve `useState` import’unu kaldır; `titles.filter(...)` yeterli.',
  ],
})
