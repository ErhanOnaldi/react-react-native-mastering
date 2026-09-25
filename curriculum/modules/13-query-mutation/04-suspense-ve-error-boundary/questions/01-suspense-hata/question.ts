import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Hata nereye gider?',
  difficulty: 'kolay',
  concepts: ['query.suspense', 'react.error-boundary'],
  question: '`useSuspenseQuery` ile ilk GET 500 döndüğünde hangi sınır gerekir?',
  options: [
    {
      text: '<Suspense> fallback’i hatayı gösterir.',
      explanation: 'Suspense yüklemeyi yakalar; hata için ErrorBoundary gerekir.',
    },
    {
      text: 'ErrorBoundary hatayı yakalar; Suspense ilk yüklemeyi gösterir.',
      correct: true,
      explanation: 'İki sınırın sorumluluğu ayrıdır.',
    },
    {
      text: '`isPending` dalı sayfada hatayı yakalar.',
      explanation: 'Suspense query ilk veriyi beklerken bileşeni render etmez.',
    },
  ],
  explanation: 'Cache’de eski veri varsa arka plan refetch hatası eski veriyi koruyabilir.',
})
