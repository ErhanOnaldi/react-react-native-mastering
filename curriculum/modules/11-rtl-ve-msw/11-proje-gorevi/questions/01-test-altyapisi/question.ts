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
    'Önce lifecycle, varsayılan HTTP cevapları ve URL başlangıçlı render sorumluluklarını ayrı ayrı planla.',
    'MSW için `setupServer`, `onUnhandledRequest: "error"`, `beforeAll`/`afterEach`/`afterAll`; Router için `createMemoryRouter` ve `RouterProvider` kullan.',
    '`renderWithRouter` içinde `Array.isArray(ui)` ile route tablosunu ayır; tek UI için wildcard route kur, `router` ile RTL sonucunu birlikte döndür.',
    'Setup dosyasında jest-dom matcher’larını içe aktar; varsayılan endpoint handler’larında `http.get` ile Authorization kontrolünü uygula.',
  ],
  rubric: [
    'Handler’lar TMDB yanıt biçimini ve Bearer kontrolünü koruyor.',
    'Lifecycle her testin handler ve DOM kalıntısını temizliyor.',
    'renderWithRouter hem UI hem routes girişinde URL parametresini aktarabiliyor.',
  ],
})
