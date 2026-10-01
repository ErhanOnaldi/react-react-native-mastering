import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Gerçek kullanıcı metriğini raporla',
  difficulty: 'orta',
  concepts: ['perf.web-vitals'],
  question: `Sinema ekibi canlı sitede LCP, INP ve CLS değerlerini gerçek ziyaretçilerden toplamak istiyor. Her tarayıcı API'si için ayrı gözlemci ve sayfa kapanış kodu yazmak yerine hangi yaklaşımı seçersin?`,
  mode: 'single',
  options: [
    {
      text: 'Kurulmuşsa `web-vitals` paketinin `onLCP`, `onINP` ve `onCLS` yardımcılarını kullanıp sonuçları RUM servisine gönderirim.',
      correct: true,
      explanation:
        'Paket tarayıcı ölçüm ayrıntılarını yönetir ve standart metrikleri callback olarak verir; uygulama bu sonuçları kendi izleme servisine gönderebilir.',
    },
    {
      text: 'Her metrik için React component render sayısını Web Vitals skoru olarak kullanırım.',
      correct: false,
      explanation:
        'Render sayısı React bileşenlerinin çalışmasını anlatır; LCP, INP ve CLS tarayıcıdaki kullanıcı deneyimi metrikleridir.',
    },
    {
      text: 'Yalnızca Lighthouse puanını her ziyaretçiden gelen saha verisi sayarım.',
      correct: false,
      explanation:
        'Lighthouse kontrollü laboratuvar ölçümüdür; gerçek ziyaretçilerin saha verisi yerine geçmez.',
    },
    {
      text: 'Her rota değişiminde metriği sıfırlar, yalnızca son ekranda oluşan kaymaları toplarım.',
      correct: false,
      explanation:
        'Bu şekilde sayfa ömründeki gerçek kullanıcı ölçümü kaybolabilir; Web Vitals yardımcıları metriğin uygun yaşam döngüsünü yönetir.',
    },
  ],
})
