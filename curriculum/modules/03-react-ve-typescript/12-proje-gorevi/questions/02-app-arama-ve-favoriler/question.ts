import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'App’te arama ve favoriler',
  difficulty: 'orta',
  concepts: [
    'react.lifting-state',
    'react.immutability',
    'react.controlled-input',
    'react.lists-keys',
    'js.array-methods',
  ],
  project: 'sinema',
  focusFiles: ['src/App.tsx', 'src/components/MovieGrid.tsx', 'src/components/SearchBox.tsx'],
  hints: [
    'Sorguyu ve favori id’lerini kim sahiplenmeli ki arama kutusu, grid ve kartlar aynı veriyi kullansın?',
    'İki değeri `App` state’inde tut; görünür filmleri başlığa göre `filter` ile türet.',
    'Favori updater’ında id varsa `ids.filter(...)`, yoksa `[...ids, id]` döndür; `SearchBox` callback’i sorgu state’ini güncellesin.',
  ],
})
