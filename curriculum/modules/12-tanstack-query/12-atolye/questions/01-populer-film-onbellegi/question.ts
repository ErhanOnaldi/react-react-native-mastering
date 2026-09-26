import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Popüler film önbelleği',
  difficulty: 'orta',
  concepts: ['query.useQuery', 'query.keys', 'query.stale-gc'],
  files: ['PopularMovies.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Kısa süre içinde aynı veri tekrar açıldığında kimin elinde kalmalı?',
    'Veriyi sabit bir query key ile iste; tazelik süresini bir dakikaya ayarla.',
    'Başarı, yükleme ve hata durumlarını ayrı göster; aynı QueryClient ile yeniden mount edilen bileşen taze veriyi kullanmalı.',
  ],
})
