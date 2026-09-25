import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Saklama ödünleşimi',
  difficulty: 'orta',
  concepts: ['auth.token-storage'],
  question: 'Backend cookie oturumu kurabiliyorsa hangi ifade doğru?',
  options: [
    {
      text: '`httpOnly` cookie JavaScript’in token’ı okumasını engeller; CSRF için de önlem gerekir.',
      correct: true,
      explanation:
        'Cookie otomatik gönderilir. SameSite ve uygun CSRF tasarımı gerekir; XSS yine kullanıcı adına istek atabilir.',
    },
    {
      text: '`localStorage` XSS’e karşı güvenlidir çünkü aynı origin ile sınırlıdır.',
      explanation: 'Aynı origin’de çalışan saldırgan JavaScript localStorage’ı okuyabilir.',
    },
    {
      text: '`httpOnly` cookie tüm XSS ve CSRF risklerini tek başına bitirir.',
      explanation:
        'Token okunmasa da XSS kullanıcı adına istek atabilir; CSRF için ayrıca politika gerekir.',
    },
  ],
})
