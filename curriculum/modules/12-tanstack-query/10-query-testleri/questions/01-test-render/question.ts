import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'İzole query render',
  difficulty: 'orta',
  concepts: ['query.testing', 'test.custom-render', 'test.rtl-queries'],
  files: ['renderWithQuery.tsx'],
  hints: [
    'Client’ı fonksiyonun içinde oluştur; modül seviyesinde tutma.',
    '`new QueryClient({ defaultOptions: { queries: { retry: false } } })` kullan.',
    'Var olan provider ve `render` dönüşünü koru.',
  ],
})
