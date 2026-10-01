import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Filtrelenmiş listeyi türet',
  difficulty: 'orta',
  concepts: ['react.derived-state', 'react.controlled-input', 'js.array-methods'],
  files: ['MovieFilter.tsx'],
  hints: [
    'Ekrandaki liste yalnızca `titles` ve `query` değerlerinden hesaplanıyor.',
    'Önce Türkçe harf duyarlı biçimde eşleşen bir başlık dizisi oluştur; sonra bunu liste öğelerine dönüştür.',
    'Yeni diziyi `titles.filter` ile üret ve arayış için `toLocaleLowerCase("tr")` kullan.',
  ],
})
