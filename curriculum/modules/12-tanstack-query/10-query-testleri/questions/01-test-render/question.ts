import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'İzole query render',
  difficulty: 'orta',
  concepts: ['query.testing', 'test.custom-render', 'test.rtl-queries'],
  files: ['renderWithQuery.tsx'],
  hints: [
    'Testin kendi cache başlangıcı olması için client nerede oluşturulmalı?',
    '`QueryClient` defaults içinde query retry değerini false yap.',
    '`render(ui, { wrapper })` çağırıp `{ client, ...view }` döndür.',
  ],
})
