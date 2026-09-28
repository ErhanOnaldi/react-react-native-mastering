import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Favori tercihini sakla',
  difficulty: 'orta',
  concepts: ['react.custom-hooks', 'react.state', 'ts.generics'],
  files: ['useLocalStorage.ts'],
  hints: [
    'İlk değer yalnızca ilk render’da storage’dan okunmalı.',
    'Başlangıç okumayı `useState(() => ...)` içine koy; `JSON.parse` hata verebilir, `try/catch` kullan.',
    'Setter’da değerin fonksiyon olup olmadığını ayır; yeni değeri hem state’e hem `localStorage` içine yaz.',
    '`JSON.stringify` boşluksuz string üretir; test storage değerini tam string olarak kontrol ediyor.',
  ],
})
