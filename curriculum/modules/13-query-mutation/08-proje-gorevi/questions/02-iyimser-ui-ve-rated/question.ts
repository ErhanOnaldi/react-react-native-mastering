import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'project',
  title: 'Optimistic yıldızlar ve Puanladıklarım',
  difficulty: 'zor',
  concepts: ['query.optimistic', 'query.invalidation', 'react.props', 'test.msw-overrides'],
  project: 'sinema',
  focusFiles: [
    'src/features/rating/hooks/useRateMovie.ts',
    'src/features/rating/components/RatingStars.tsx',
    'src/pages/RatedPage.tsx',
    'src/router.tsx',
  ],
  hints: [
    'Puan, session ve rated liste arasındaki veri kimliğini bütün ekranlarda tutarlı kıl.',
    '`onMutate`, `cancelQueries`, snapshot ve `onError` rollback callback’lerini kullan.',
    'İlgili listeyi `onSettled` içinde yenile; kontrolü erişilebilir butonlarla sun ve `/rated` sayfasını bağla.',
  ],
})
