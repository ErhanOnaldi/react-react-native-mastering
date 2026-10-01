import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Dövüş Kulübü nereden geldi?',
  difficulty: 'kolay',
  concepts: ['test.msw', 'fetch.headers-auth'],
  question: 'Testte gerçek ağ kapalıyken /3/movie/550 nasıl Türkçe film döndürür?',
  options: [
    {
      text: 'MSW, TMDB isteğini yakalayıp fixture cevabını döndürür',
      correct: true,
      explanation: 'setupServer handler’ları gerçek fetch akışında yanıt üretir.',
    },
    {
      text: 'Vitest fetch’i otomatik olarak vi.fn yapar',
      explanation: 'Vitest fetch’i kendiliğinden mock’lamaz; ağ MSW handler’ından geçer.',
    },
    {
      text: 'React Router filmi bellekte saklar',
      explanation: 'Router URL ve navigasyonu yönetir; TMDB cevabını üretmez.',
    },
  ],
})
