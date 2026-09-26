import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Route ne zaman kurulur?',
  difficulty: 'orta',
  concepts: ['test.playwright-network', 'test.msw'],
  question:
    'Sinema açılır açılmaz TMDB trend isteği atıyor. Testte route’u `page.goto()` sonrasında kurarsan ne olabilir?',
  options: [
    {
      text: 'İlk istek route’a yakalanmadan gerçek TMDB’ye gider',
      correct: true,
      explanation: 'Evet. İlk yükleme isteği çoktan çıkmış olabilir; route’u gezinmeden önce kur.',
    },
    {
      text: 'Playwright eski isteğe de geriye dönük yanıt verir',
      correct: false,
      explanation: 'Route geçmiş isteklere uygulanmaz; yalnızca kayıt sonrası istekleri yakalar.',
    },
    {
      text: 'MSW otomatik olarak isteği devralır',
      correct: false,
      explanation:
        'Vitest’in MSW sunucusu ayrı süreçtedir; tarayıcı isteğini kendiliğinden devralmaz.',
    },
  ],
  explanation: '',
})
