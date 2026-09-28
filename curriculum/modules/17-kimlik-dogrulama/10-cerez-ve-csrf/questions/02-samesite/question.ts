import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Çapraz site çerezi',
  difficulty: 'orta',
  concepts: ['security.cookies', 'security.csrf'],
  question:
    'Çapraz site bağlamında gönderilmesi gereken bir çerez `SameSite=None` kullanıyor. Hangi eşlik eden ayar gerekir?',
  options: [
    {
      text: '`Secure`',
      correct: true,
      explanation: 'SameSite=None çerezleri Secure ile verilmelidir; böylece HTTPS dışına çıkmaz.',
    },
    {
      text: '`HttpOnly` tek başına yeterlidir.',
      correct: false,
      explanation: 'HttpOnly JS erişimini kapatır; SameSite=None için Secure koşulunu karşılamaz.',
    },
    {
      text: '`Path=/login`',
      correct: false,
      explanation: 'Path kapsamı URL yolunu sınırlar, güvenli aktarım koşulunu sağlamaz.',
    },
  ],
})
