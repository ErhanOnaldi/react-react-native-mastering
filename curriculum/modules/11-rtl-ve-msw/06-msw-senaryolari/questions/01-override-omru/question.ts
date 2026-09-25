import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Override ne kadar yaşar?',
  difficulty: 'kolay',
  concepts: ['test.msw-overrides'],
  question: 'Bir testte server.use ile arama endpoint’ine 500 verdin. Sonraki test ne alır?',
  options: [
    {
      text: 'Varsayılan handler; setup afterEach resetHandlers çağırır',
      correct: true,
      explanation: 'Testler birbirinden bağımsız kalır.',
    },
    {
      text: 'Yine 500; server.use tüm test dosyasına kalıcıdır',
      explanation: 'resetHandlers çalışma zamanı override’larını temizler.',
    },
    {
      text: 'Gerçek TMDB yanıtı',
      explanation: 'MSW sunucusu test boyunca açıktır; gerçek ağa çıkılmaz.',
    },
  ],
})
