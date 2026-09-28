import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Filtreli sanal liste',
  difficulty: 'orta',
  concepts: ['perf.virtualization', 'perf.transitions', 'react.lists-keys'],
  files: ['FilteredVirtualMovies.tsx'],
  hints: [
    'Sorgu değişince sanal listenin satır sayısı ve kimlikleri hangi veriye dayanmalı?',
    'Önce filtreli diziyi üret; virtualizer count ve getItemKey değerlerini bu diziye bağla.',
    "`filtered[row.index]` ile render et, `getItemKey` film id'si döndürsün.",
  ],
})
