import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: '204 cevabının gövdesi',
  difficulty: 'kolay',
  concepts: ['web.http-anatomy', 'fetch.basics'],
  question: 'Bir silme isteği `204 No Content` döndürdü. Cevap nasıl işlenmeli?',
  options: [
    {
      text: '`response.ok` kontrolünden sonra gövde okunmadan başarı kabul edilir.',
      correct: true,
      explanation: '204 başarılıdır ve gövdesi yoktur; JSON ayrıştırmaya çalışmak hata üretir.',
    },
    {
      text: '`response.json()` çağrılıp boş nesne beklenir.',
      correct: false,
      explanation: '204 cevabında JSON gövdesi bulunmaz.',
    },
    {
      text: '204 bir yönlendirme olduğu için yeni URL beklenir.',
      correct: false,
      explanation: '204, 2xx başarı ailesindedir; yönlendirme 3xx ailesindedir.',
    },
    {
      text: '`fetch` Promise’inin reddedilmesi beklenir.',
      correct: false,
      explanation: 'Sunucu başarılı HTTP cevabı vermiştir.',
    },
  ],
})
