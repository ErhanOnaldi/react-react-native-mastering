import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'HttpOnly sınırı',
  difficulty: 'kolay',
  concepts: ['security.cookies', 'security.xss'],
  question: '`HttpOnly` oturum çerezi için doğru ifade hangisi?',
  options: [
    {
      text: 'JavaScript çerezi okuyamaz; tarayıcı uygun istekte çerezi gönderebilir.',
      correct: true,
      explanation: 'HttpOnly okuma erişimini kapatır, ağdaki çerez gönderimini kaldırmaz.',
    },
    {
      text: 'Çerez hiçbir HTTP isteğinde gönderilmez.',
      correct: false,
      explanation: 'Oturumun çalışması için tarayıcı uygun isteğe çerezi ekler.',
    },
    {
      text: 'Çerez XSS kodunun uygulamada işlem yapmasını bütünüyle engeller.',
      correct: false,
      explanation: 'XSS çerezi okuyamasa da aynı origin içinde kullanıcı adına istek başlatabilir.',
    },
  ],
})
