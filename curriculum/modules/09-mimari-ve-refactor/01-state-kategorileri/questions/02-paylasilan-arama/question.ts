import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Paylaşılabilir arama',
  difficulty: 'orta',
  concepts: ['arch.state-categories', 'router.search-params'],
  question:
    '“Matrix, 2. sayfa” bağlantısını arkadaşıma gönderince aynı sonuç açılsın. Hangi değerler URL’de olmalı?',
  options: [
    {
      text: 'q ve page',
      correct: true,
      explanation: 'Doğru. Arama ve sayfa gezinmeyle paylaşılacak seçimlerdir.',
    },
    {
      text: 'Sonuç listesinin tamamı',
      explanation: 'Sonuçlar TMDB’den gelir; URL’ye tüm JSON’u koymak sahipliği karıştırır.',
    },
    {
      text: 'Yalnız favori id’leri',
      explanation: 'Favoriler yerel tercihtir; bu bağlantının arama seçimini anlatmaz.',
    },
    {
      text: 'Yalnız loading bayrağı',
      explanation: 'Loading istek sırasında oluşur; paylaşılacak kalıcı bir seçim değildir.',
    },
  ],
})
