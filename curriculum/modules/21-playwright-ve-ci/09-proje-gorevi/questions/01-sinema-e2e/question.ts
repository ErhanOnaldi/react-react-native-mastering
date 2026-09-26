import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema’nın iki kritik yolunu tarayıcıda koru',
  difficulty: 'zor',
  concepts: [
    'test.e2e',
    'test.playwright-config',
    'test.playwright-locators',
    'test.playwright-assertions',
    'test.playwright-network',
    'router.protected-routes',
  ],
  project: 'sinema',
  focusFiles: [
    'playwright.config.ts',
    'vite.config.ts',
    'e2e/search.spec.ts',
    'e2e/auth-watchlist.spec.ts',
    'package.json',
  ],
  reviewFiles: ['playwright.config.ts', 'e2e/**/*.spec.ts'],
  rubric: [
    'Arama ve giriş akışları kullanıcı davranışını gerçekten yürütür; yalnızca kaynak metni veya URL’yi sınamaz.',
    'TMDB ve DummyJSON istekleri page.route ile sabitlenir; TMDB Bearer başlığı eksikse 401 döner.',
    'Locator’lar erişilebilir rol ve adları kullanır; sabit sleep yerine web-first assertion bulunur.',
  ],
  timeoutMs: 240_000,
  hints: [
    'Önce `playwright.config.ts` için ders 02’deki 5174 ayarını gerçek dosyaya taşı; `@playwright/test` paketini devDependency olarak ekle.',
    'TMDB için `/genre/movie/list`, `/trending/movie/week`, `/search/movie`, `/movie/550` isteklerini küçük sabit yanıtlarla karşıla. DummyJSON girişinde `emilys` / `emilyspass` kullan.',
    'İlk spec ana sayfadan aramaya gidip 550 detayını açsın; ikinci spec boş oturumla `/watchlists` açıp giriş formunu tamamlasın ve listede yeni adı görsün.',
  ],
})
