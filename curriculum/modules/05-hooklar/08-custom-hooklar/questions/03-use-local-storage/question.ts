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
    'Güncelleme parametresi bir değer ya da önceki değeri alan fonksiyon olabilir; ikisini ayırıp state setter’ına aktar.',
    'Dönüş tipi için `ValueUpdater<T>` kullan; `value` değişimini `JSON.stringify` ile storage içine yaz.',
  ],
})
