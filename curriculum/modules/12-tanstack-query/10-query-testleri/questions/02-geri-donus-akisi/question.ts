import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Geri dönüş akışı',
  difficulty: 'orta',
  concepts: ['query.testing', 'query.useQuery', 'router.search-params', 'test.msw'],
  files: ['SearchAgain.tsx'],
  hints: [
    'Arama sonucunu ayrı bir child component yap ki detay görünümünde unmount olsun.',
    'Child içinde `useQuery` key’ine normalize `query` ekle ve `staleTime` ayarla.',
    'Button ile `details` state’ini değiştir; detayda yalnız metin, dönüşte `<Results query={query} />` göster.',
  ],
})
