import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Filtreleri koruyarak URL’yi güncelle',
  difficulty: 'orta',
  concepts: ['router.search-params', 'react.controlled-input', 'react.immutability', 'ts.union'],
  files: ['SearchControls.tsx'],
  hints: [
    'Tek doğru kaynak `useSearchParams` sonucu.',
    'Setter callback’inde önceki parametreleri kopyala, değişen anahtarı yaz ve `page` değerini sil.',
  ],
})
