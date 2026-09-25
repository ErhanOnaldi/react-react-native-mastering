import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Form tipini şemadan türet',
  difficulty: 'orta',
  concepts: ['zod.infer', 'ts.inference'],
  files: ['watchlist.ts'],
  hints: [
    'Adı trimlediğinde çıktının hangi tipte kaldığını düşün.',
    '`watchlistSchema` kuralını tek yerde yaz; `WatchlistValues` için `z.infer<typeof watchlistSchema>` kullan.',
    '`createWatchlist(raw)` içinde şemayı parse et; `name` için `.trim().min(1)` ve `isPublic` için `z.boolean()` seç.',
  ],
})
