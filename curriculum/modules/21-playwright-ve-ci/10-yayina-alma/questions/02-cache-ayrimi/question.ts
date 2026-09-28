import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'HTML ile asset neden ayrı cachelenir?',
  difficulty: 'orta',
  concepts: ['deploy.cache-headers', 'web.http-cache'],
  question:
    'Yeni sürümde `app-a1.js` yerine `app-b2.js` çıktı. Hangi cache eşlemesi kullanıcıya yeni sürümü güvenle ulaştırır?',
  options: [
    {
      text: '`index.html`: `no-cache`; hash’li asset: `public, max-age=31536000, immutable`',
      correct: true,
      explanation:
        'HTML yeniden doğrulanır ve yeni dosya adına işaret eder; değişmeyen eski asset uzun süre saklanabilir.',
    },
    {
      text: '`index.html`: bir yıl `immutable`; hash’li asset: `no-store`',
      correct: false,
      explanation:
        'Eski HTML yeni asset adını öğrenemez; hash’li dosyanın uzun cachelenmesi ise güvenlidir.',
    },
    {
      text: 'İkisi de `no-store`; hash’li isimlerin cache ile ilgisi yoktur.',
      correct: false,
      explanation:
        'İçerik hash’i değişen içerikte URL’yi değiştirir ve uzun süreli asset cache’ini güvenli kılar.',
    },
  ],
})
