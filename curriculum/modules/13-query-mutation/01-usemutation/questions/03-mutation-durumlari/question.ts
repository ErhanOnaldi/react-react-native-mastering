import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Puan butonunda mutation durumları',
  difficulty: 'orta',
  concepts: ['query.useMutation', 'react.events', 'fetch.loading-states'],
  files: ['RateButton.tsx'],
  hints: [
    'useMutation({ mutationFn: rate }) ile durum nesnesi al.',
    'Click’te mutate({ movieId, value: 8.5 }) çağır.',
    'isPending butonu; isSuccess ve isError mesajları yönetir.',
  ],
})
