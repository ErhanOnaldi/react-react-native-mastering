import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'RTK Query seçimi',
  difficulty: 'kolay',
  concepts: ['redux.server-vs-client'],
  question:
    'Sinema TMDB için zaten TanStack Query kullanıyor. RTK Query ekleme kararı için en güçlü gerekçe hangisi?',
  options: [
    {
      text: 'Server cache mimarisini bilinçli olarak bütünüyle değiştirme ihtiyacı.',
      correct: true,
      explanation: 'Aynı endpoint iki cache’e bölünmemelidir.',
    },
    {
      text: 'Favori yıldızı için localStorage gerekir.',
      correct: false,
      explanation: 'Bu client state ve listener konusudur.',
    },
    {
      text: 'Redux store kurulunca Query çalışmaz.',
      correct: false,
      explanation: 'İki araç farklı state kategorilerini birlikte yönetebilir.',
    },
  ],
})
