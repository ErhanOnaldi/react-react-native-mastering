import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Stale ama mevcut',
  difficulty: 'kolay',
  concepts: ['query.stale-gc', 'fetch.loading-states'],
  question:
    '90 saniye sonra geri dönüldü; cache henüz silinmedi ama `staleTime` 60 saniye. Hangi UI mümkündür?',
  options: [
    {
      text: 'Eski veri görünür ve `isFetching` ile yenileme gösterilir',
      correct: true,
      explanation: 'Stale veri cache’den okunurken arka plan refetch yapılabilir.',
    },
    {
      text: 'Veri zorunlu olarak undefined olur',
      explanation: 'Stale olmak silinmek demek değildir.',
    },
    {
      text: 'gcTime veriyi otomatik tazeler',
      explanation: 'gcTime refetch başlatmaz; yalnız kullanılmayan cache girdisini toplar.',
    },
  ],
})
