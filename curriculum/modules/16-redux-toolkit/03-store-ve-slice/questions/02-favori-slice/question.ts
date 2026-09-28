import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Favori kuralını slice’a taşı',
  difficulty: 'orta',
  concepts: ['redux.slice', 'react.immutability'],
  files: ['favorites.ts'],
  hints: [
    'Aynı olayı tekrar uyguladığında mevcut seçim tersine dönmeli; diğer ID’ler yerinde kalmalı.',
    'Dizide varlık kontrolü için `indexOf` kullan; Immer draft üzerinde `push` ve `splice` geçerlidir.',
    'İndeks `-1` ise `state.ids.push(id)`, aksi halde `state.ids.splice(index, 1)` uygula.',
  ],
})
