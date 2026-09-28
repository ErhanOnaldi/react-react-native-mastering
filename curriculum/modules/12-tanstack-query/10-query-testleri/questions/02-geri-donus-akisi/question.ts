import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Geri dönüş akışı',
  difficulty: 'orta',
  concepts: ['query.testing', 'query.useQuery', 'router.search-params', 'test.msw'],
  files: ['SearchAgain.tsx'],
  hints: [
    'Detay görünümünde arama component’i ağaçtan ayrılmalı; hangi UI sınırı bunu sağlar?',
    'Arama child’ında `useQuery` key’ine temizlenmiş `query` ekle ve 60 saniyelik tazelik ver.',
    '`details` state ile iki görünümü seç; Geri’de `<Results query={query} />` göster.',
  ],
})
