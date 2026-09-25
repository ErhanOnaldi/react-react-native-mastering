import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Paylaşılan listeyi optimistic güncelle',
  difficulty: 'orta',
  concepts: ['query.optimistic', 'query.invalidation', 'test.msw-overrides'],
  files: ['useOptimisticRating.ts'],
  hints: [
    '`onMutate` async olabilir: önce cancelQueries.',
    'getQueryData ile önceki diziyi döndür; setQueryData ile yeni dizi yaz.',
    'onError context.previous değerini geri koy; onSettled invalidation yapsın.',
  ],
})
