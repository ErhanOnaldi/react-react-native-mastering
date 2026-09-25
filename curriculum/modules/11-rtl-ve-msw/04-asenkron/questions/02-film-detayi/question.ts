import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Asenkron film detayı bileşeni',
  difficulty: 'orta',
  concepts: ['test.async', 'test.msw', 'fetch.loading-states'],
  files: ['MovieTitle.tsx'],
  hints: [
    'loading/error/success state’lerini ayır.',
    'useEffect içinde fetch yap; response.ok kontrol et.',
    'Cleanup için active bayrağı kullan; eski isteğin sonucunu yok say.',
  ],
})
