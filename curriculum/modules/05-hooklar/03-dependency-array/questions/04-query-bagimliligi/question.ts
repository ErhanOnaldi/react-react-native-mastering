import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Arama parametresini izle',
  difficulty: 'orta',
  concepts: ['react.useEffect.deps', 'react.controlled-input', 'fetch.query-params'],
  files: ['SearchCount.tsx'],
  hints: [
    'Boş query için effect içinde erken dön.',
    'URLSearchParams özel karakterleri güvenle kodlar.',
    'Dependency listesine yeni kurduğun URL nesnesini değil, `query` string’ini koy.',
  ],
})
