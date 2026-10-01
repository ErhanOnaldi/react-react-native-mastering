import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Önceki sorguyu hatırla',
  difficulty: 'orta',
  concepts: ['react.useRef', 'react.useEffect', 'react.useEffect.deps'],
  files: ['PreviousQuery.tsx'],
  hints: [
    '“Önceki” değer, bu render’dan önce saklanmış değer olmalı.',
    'Render sırasında görüntülenecek eski değeri sakla; yeni değer ancak bu render tamamlandıktan sonra kaydedilmeli.',
    'Bir ref ilk değeri `null` alsın; `useEffect` içinde `query` değerini dependency değişince ref’e yaz.',
  ],
})
