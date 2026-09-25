import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Mutasyon sinyali',
  difficulty: 'kolay',
  concepts: ['react.immutability'],
  question:
    '`favoriteIds.push(550); setFavoriteIds(favoriteIds)` sonrası ekranda işaret niçin kalabilir?',
  options: [
    {
      text: 'State’e aynı dizi referansı geri verilir.',
      correct: true,
      explanation: 'Yeni içerik olsa da referans değişmez; yeni dizi üretmek gerekir.',
    },
    {
      text: 'React sayıları state’te tutamaz.',
      correct: false,
      explanation: 'Sayılar ve sayı dizileri state’te tutulabilir.',
    },
    {
      text: 'push yeni dizi döndürür.',
      correct: false,
      explanation: 'push diziyi yerinde değiştirir ve yeni uzunluğu döndürür.',
    },
  ],
})
