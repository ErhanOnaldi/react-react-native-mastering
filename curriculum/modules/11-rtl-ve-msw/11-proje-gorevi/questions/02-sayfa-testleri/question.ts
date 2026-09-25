import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Arama ve detay sayfasını test et',
  difficulty: 'zor',
  concepts: ['test.user-event', 'test.async', 'test.msw-overrides', 'router.search-params'],
  project: 'sinema',
  focusFiles: ['src/pages/SearchPage.test.tsx', 'src/pages/MovieDetailsPage.test.tsx'],
  reviewFiles: ['src/pages/SearchPage.test.tsx', 'src/pages/MovieDetailsPage.test.tsx'],
  hints: [
    'Önce happy path: role/name ile başlığı bul; URL için memory router kullan.',
    'Arama etkileşimini await user.type ile yap; debounce için waitFor içinde URL veya istek günlüğünü denetle.',
    'Boş ve hata durumlarında server.use ile ilgili endpoint’i override et; afterEach resetHandlers bunu temizler.',
  ],
  rubric: [
    'Testler kullanıcı etkileşimini ve ekranda görünen sonucu bağlıyor.',
    'Arama testi query, boş ve 500 senaryolarını kapsıyor.',
    'Detay testi 550 ve 404 için görünür davranışı kapsıyor.',
    'Sabit bekleme veya fetch mock sırasına bağımlılık yok.',
  ],
})
