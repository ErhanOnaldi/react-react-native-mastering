import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Aynı sayfada detay değişmiyor',
  difficulty: 'orta',
  concepts: ['react.useEffect.deps', 'fetch.loading-states'],
  files: ['MovieDetail.tsx'],
  hints: [
    'İlk açılışta doğru film geliyor. Aynı bileşen açık kalırken hangi değer değişiyor?',
    'Dış sistemden alınan detay, gelen film kimliğiyle eşleşmeli; önceki detayın yeni kimlik altında görünmesini de düşün.',
    'Effect’i `id` değişiminde yeniden çalıştır; yeni cevap gelene kadar eski başlığı temizle ve yeni id için istek gönder.',
    'Eski istek geç dönebilirse cleanup ile yazma hakkını kaldır veya isteği iptal et.',
  ],
  preview: { entry: 'Preview.tsx' },
})
