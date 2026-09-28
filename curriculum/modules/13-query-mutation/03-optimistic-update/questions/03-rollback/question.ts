import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Paylaşılan listeyi optimistic güncelle',
  difficulty: 'orta',
  concepts: ['query.optimistic', 'query.invalidation', 'test.msw-overrides'],
  files: ['useOptimisticRating.ts'],
  hints: [
    'Geçici liste yazısını eski GET’in ezmesini ve hata halinde neyin geri konacağını düşün.',
    '`onMutate`, `cancelQueries`, `getQueryData` ve `setQueryData` callback’lerini eşleştir.',
    '`onMutate` içinde snapshot’ı context olarak döndür; `onError` bunu geri yüklesin.',
    '`onSettled` içinde ilgili session key’ini invalidate et; bu görevde tek mutation varsayımı geçerli.',
  ],
})
