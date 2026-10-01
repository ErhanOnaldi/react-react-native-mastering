import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Geri dönüş sayacı',
  difficulty: 'kolay',
  concepts: ['fetch.basics', 'router.navigation', 'query.keys'],
  question: `Arama ekranı açılınca bir istek gider. Detay ekranına geçince arama component’i kaldırılır; geri dönünce yeniden oluşturulur. Cache yoksa iki açılışta toplam kaç arama isteği gider?`,
  options: [
    {
      text: '2',
      correct: true,
      explanation: 'İlk mount ve geri dönüşteki yeni mount birer GET başlatır.',
    },
    {
      text: '1',
      explanation: 'Router eski component state’ini ve API cevabını geri dönüş için saklamaz.',
    },
    { text: '0', explanation: 'İlk arama canlı TMDB isteği başlatır.' },
    {
      text: 'Her URL parametresi değişikliğinde bir GET; bu akışta toplam 2',
      explanation:
        'Burada arama aynı kaldığı için iki mount iki istek başlatır; render sayısı istek sayısı değildir.',
    },
  ],
})
