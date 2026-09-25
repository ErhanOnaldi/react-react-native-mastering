import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: '404 neden fırlamadı?',
  difficulty: 'kolay',
  concepts: ['arch.api-client', 'arch.api-error', 'fetch.error-handling'],
  question: '`fetch("/movie/999999")` 404 cevabı aldı ama `catch` çalışmadı. Neden?',
  options: [
    {
      text: 'fetch HTTP 404 için resolve olur; response.ok kontrol edilir',
      correct: true,
      explanation: 'Doğru. Ağ hatası ile HTTP hata cevabı farklıdır.',
    },
    {
      text: 'fetch yalnız 200 için resolve olur',
      explanation: '404 de bir HTTP cevabıdır; Promise çoğu zaman başarıyla çözülür.',
    },
    {
      text: 'TypeScript catch’i siler',
      explanation: 'TypeScript çalışma zamanı HTTP davranışını değiştirmez.',
    },
    {
      text: 'Bearer başlığı 404’ü otomatik yakalar',
      explanation: 'Authorization kimlik bildirir; hata kontrolünü yapmaz.',
    },
  ],
})
