import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Ham API sonucu',
  difficulty: 'kolay',
  concepts: ['ts.unknown-any'],
  question: 'Şeklini doğrulamadığın JSON değeri için en dürüst başlangıç tipi hangisi?',
  options: [
    {
      text: '`unknown`',
      correct: true,
      explanation: 'Okumadan önce kontrol ister; belirsizliği görünür kılar.',
    },
    { text: '`any`', explanation: 'Tip denetimini kapatır; yazım hatasını da saklar.' },
    { text: '`Movie`', explanation: 'API’nin Movie döndürdüğünü henüz kanıtlamadın.' },
  ],
})
