import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Doğrulama sınırı',
  difficulty: 'kolay',
  concepts: ['zod.api-validation', 'arch.api-client'],
  question: 'TMDB 200 ama `title: null` döndürdü. Hata en erken nerede yakalanmalı?',
  options: [
    {
      text: 'API client JSON’u şemayla okurken.',
      correct: true,
      explanation: 'Doğru. Veri UI ve Query cache’e girmeden önce doğrulanır.',
    },
    {
      text: 'Detay başlığında `.toUpperCase()` çalışınca.',
      correct: false,
      explanation: 'Bu yaklaşım kullanıcıya çökme gösterir ve hata bağlamını kaybeder.',
    },
    {
      text: 'Sadece TypeScript derlemesinde.',
      correct: false,
      explanation: 'Derleyici uzak sunucunun o anki JSON’unu görmez.',
    },
  ],
})
