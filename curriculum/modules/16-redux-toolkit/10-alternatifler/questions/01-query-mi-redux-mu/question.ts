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
      text: 'Ekip aynı TMDB endpoint’lerini TanStack Query ve RTK Query cache’inde birlikte tutmak istiyor.',
      correct: false,
      explanation:
        'İki cache aynı endpoint verisini ayrı ayrı sahiplenir; RTK Query’ye geçiş varsa aynı sorgular için tek cache seçilmelidir.',
    },
    {
      text: 'TanStack Query kullanan her ekranda ikinci bir Redux store açmak gerekir.',
      correct: false,
      explanation:
        'Bir uygulamada Query ve Redux farklı state türleri için birlikte bulunabilir; aynı server cache’i iki kez kurmak gerekmez.',
    },
  ],
})
