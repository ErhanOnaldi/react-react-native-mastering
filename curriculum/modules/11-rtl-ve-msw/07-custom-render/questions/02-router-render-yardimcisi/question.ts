import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Router’lı render yardımcı fonksiyonu',
  difficulty: 'orta',
  concepts: ['test.custom-render', 'router.params'],
  files: ['renderWithRouter.tsx'],
  hints: [
    'Helper çağrısında route kalıbı, başlangıç adresi ve UI’nin nerede çalışacağını ayır.',
    '`createMemoryRouter`, `RouterProvider` ve RTL `render` fonksiyonlarını birleştir.',
    'Tek route kur; `initialEntries: [route]` ver ve `{ router, ...renderResult }` döndür.',
  ],
})
