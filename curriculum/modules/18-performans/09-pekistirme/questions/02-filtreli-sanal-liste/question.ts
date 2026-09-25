import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Filtreli sanal liste',
  difficulty: 'orta',
  concepts: ['perf.virtualization', 'perf.transitions', 'react.lists-keys'],
  files: ['FilteredVirtualMovies.tsx'],
  hints: [
    'Önce filtreli diziyi üret; sanallaştırmayı ona uygula.',
    'Count ve getItemKey aynı diziyi okumalı.',
    "`filtered[row.index]` ile render et, `getItemKey` film id'si döndürsün.",
  ],
})
