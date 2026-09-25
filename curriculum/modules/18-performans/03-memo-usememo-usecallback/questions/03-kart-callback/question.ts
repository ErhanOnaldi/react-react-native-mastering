import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Kart callback kimliği',
  difficulty: 'orta',
  concepts: ['perf.memo', 'react.useCallback', 'react.props'],
  files: ['FavoriteCards.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Sayacın gerçekten etkilediği ve etkilemediği bileşenleri ayır.',
    '`memo` ile kartı sar; favori callback referansını sabit tut.',
    '`useCallback((title) => setFavorite(title), [])` ve `memo(Card)` birlikte kullan.',
  ],
})
