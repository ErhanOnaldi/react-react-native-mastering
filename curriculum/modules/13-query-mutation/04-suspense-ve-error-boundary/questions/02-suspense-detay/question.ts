import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Detayın bekleme ve hata sınırlarını kur',
  difficulty: 'orta',
  concepts: ['query.suspense', 'react.suspense', 'react.error-boundary'],
  files: ['MovieDetail.tsx'],
  hints: [
    'İçerik hazır değilken hangi sarmalayıcının beklediğini, hata olunca hangisinin yakaladığını düşün.',
    'İçerik bileşeninde `useSuspenseQuery`; dışında `<Suspense>` ve hata sınırı kullan.',
    '`queryKey: ["movie", id]`, `queryFn: () => load(id)`; bekleme metni `Film yükleniyor…` olsun.',
    'Hata sınırı `getDerivedStateFromError` ile hata durumunu işaretleyip `role="alert"` göstermeli.',
  ],
})
