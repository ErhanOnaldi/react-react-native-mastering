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
    'Önce her sayfa için URL, kullanıcı eylemi ve beklenen görünür sonucu tek tek yaz.',
    '`renderWithRouter`, `userEvent.setup`, `findBy`/`waitFor` ve MSW `server.use` ile senaryoları çalıştır.',
    'Arama için Matrix query ve empty/500 response; detay için 550/404 response üret. Her test kendi initial route ve handler’ını kursun.',
  ],
  rubric: [
    'Testler kullanıcı etkileşimini ve ekranda görünen sonucu bağlıyor.',
    'Arama testi query, boş ve 500 senaryolarını kapsıyor.',
    'Detay testi 550 ve 404 için görünür davranışı kapsıyor.',
    'Sabit bekleme veya fetch mock sırasına bağımlılık yok.',
  ],
})
