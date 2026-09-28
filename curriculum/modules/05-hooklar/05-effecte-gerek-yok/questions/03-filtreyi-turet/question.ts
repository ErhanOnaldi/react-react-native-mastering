import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Filtrelenmiş listeyi türet',
  difficulty: 'orta',
  concepts: ['react.derived-state', 'react.controlled-input', 'js.array-methods'],
  files: ['MovieFilter.tsx'],
  hints: [
    'Ekrandaki liste yalnızca `titles` ve `query` değerlerinden hesaplanıyor.',
    'Bu durum için ayrı state yerine render sırasında türetilmiş değer kullan.',
    '`useEffect` ve `useState` import’unu kaldır; `const visible = titles.filter(...)` yaz.',
    'Karşılaştırmada iki tarafı da `toLocaleLowerCase("tr")` ile küçült.',
  ],
})
