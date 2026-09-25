import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Router’lı render yardımcı fonksiyonu',
  difficulty: 'orta',
  concepts: ['test.custom-render', 'router.params'],
  files: ['renderWithRouter.tsx'],
  hints: [
    'createMemoryRouter ve render fonksiyonlarını birleştir.',
    'RouterProvider’ı react-router/dom’dan import et.',
    'render sonucunu spread edip router’ı da döndür.',
  ],
})
