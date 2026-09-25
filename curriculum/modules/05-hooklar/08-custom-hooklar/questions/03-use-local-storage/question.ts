import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Favori tercihini sakla',
  difficulty: 'orta',
  concepts: ['react.custom-hooks', 'react.state', 'ts.generics'],
  files: ['useLocalStorage.ts'],
  hints: [
    'Başlangıç okumayı `useState(() => ...)` içine koy.',
    '`JSON.parse` hata verebilir; `try/catch` kullan.',
    'Setter’da `JSON.stringify` ile sakla.',
  ],
})
