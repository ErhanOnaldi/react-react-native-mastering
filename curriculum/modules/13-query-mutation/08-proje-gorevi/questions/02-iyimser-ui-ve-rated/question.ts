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
    'Önce ratedMoviesQuery key’ini bütün okuma/yazma yerlerinde paylaş.',
    'onMutate: cancel, snapshot, setQueryData; onError: snapshot; onSettled: invalidate.',
    'RatingStars’ı erişilebilir butonlarla kur; RatedPage query sonucunu listele.',
  ],
})
