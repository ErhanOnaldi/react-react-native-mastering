import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema test altyapısını kur',
  difficulty: 'zor',
  concepts: ['test.msw', 'test.custom-render', 'router.setup'],
  project: 'sinema',
  focusFiles: ['src/test/setup.ts', 'src/test/msw/handlers.ts', 'src/test/render.tsx'],
  reviewFiles: ['src/test/setup.ts', 'src/test/msw/handlers.ts', 'src/test/render.tsx'],
  hints: [
    'Önce handlers.ts ve setup.ts kur; onUnhandledRequest error gerçek ağa sızmayı görünür kılar.',
    'renderWithRouter içinde ui dizi ise route’ları kullan; değilse mevcut route için tek route oluştur.',
    'createMemoryRouter(routes, { initialEntries: [route] }); render(<RouterProvider router={router} />); return { router, ...result }.',
  ],
  rubric: [
    'Handler’lar TMDB yanıt biçimini ve Bearer kontrolünü koruyor.',
    'Lifecycle her testin handler ve DOM kalıntısını temizliyor.',
    'renderWithRouter hem UI hem routes girişinde URL parametresini aktarabiliyor.',
  ],
})
