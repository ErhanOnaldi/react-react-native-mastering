import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Kart slot’ları',
  difficulty: 'kolay',
  concepts: ['react.composition', 'react.children'],
  files: ['MoviePanel.tsx'],
  hints: [
    'Ana içerik ile alt eylem nerede görünmeli; alt eylem verilmediğinde ne olmalı?',
    'Ana içerik ile isteğe bağlı eylemin props alanlarını belirle.',
    '`ReactNode` iki alan için de uygundur; footer yalnızca `actions` verilmişse üret.',
    '`article` içine `children`, `actions === undefined` değilse `<footer>{actions}</footer>` koy.',
  ],
})
