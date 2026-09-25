import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama durumları',
  difficulty: 'orta',
  concepts: ['query.useQuery', 'ts.discriminated-union', 'fetch.error-handling'],
  files: ['SearchStatus.tsx'],
  hints: [
    'Önce gerçek TMDB isteğini ve Bearer başlığını kur.',
    '`response.ok` değilse hata fırlat; `status` için pending/error/success dalları aç.',
    'Success dalında `results.length === 0` kontrolünden sonra `<ul>` render et.',
  ],
})
