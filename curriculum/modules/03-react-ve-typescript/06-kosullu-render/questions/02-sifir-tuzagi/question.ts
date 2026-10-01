import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sıfır tuzağı',
  difficulty: 'kolay',
  concepts: ['react.conditional-rendering', 'ts.narrowing'],
  files: ['FavoriteSummary.tsx'],
  hints: [
    '`&&` sol taraftaki değeri döndürür; 0 ile ne olur?',
    'Koşulu boolean’a çevir veya iki dalı ternary ile göster.',
    '`count > 0 ? <p>{count} favori</p> : <p>Henüz favori yok</p>` kullan.',
  ],
})
