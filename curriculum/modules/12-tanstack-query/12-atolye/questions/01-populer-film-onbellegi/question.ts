import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Popüler film önbelleği',
  difficulty: 'orta',
  concepts: ['query.useQuery', 'query.keys', 'query.stale-gc'],
  files: ['PopularMovies.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Ekran kapanınca verinin silinmemesi ve taze sayılması için hangi iki süre kararı gerekir?',
    '`useQuery` içinde sabit key ve bir dakikalık `staleTime` ayarla.',
    'Success, pending ve error dallarını göster; aynı client ile tekrar açılışta cache’i kullan.',
  ],
})
