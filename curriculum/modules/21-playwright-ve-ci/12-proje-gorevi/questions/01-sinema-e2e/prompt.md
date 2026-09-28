## Bağlam

Sinema’nın birim ve entegrasyon testleri yeşil olsa da `/login` route’u korumalı gruba taşındığında gerçek giriş akışı kırılıyor. Bu iki yol tarayıcıda korunacak.

## 1. Playwright kurulumu

`projects/sinema/package.json` içine `@playwright/test` **devDependency** ekle (`pnpm-workspace.yaml` catalog sürümüyle aynı). `playwright.config.ts` dosyası `defineConfig` kullanmalı:

| Alan | Değer |
| --- | --- |
| `testDir` | `./e2e` |
| `use.baseURL` | `http://localhost:5174` |
| `projects` | Chromium projesi |
| `webServer.command` | `pnpm dev` |
| `webServer.url` | `http://localhost:5174` |
| `webServer.reuseExistingServer` | Yerelde evet, CI’da hayır (`!process.env.CI`) |
| `webServer.env.VITE_TMDB_TOKEN` | Boş olmayan **sahte** token |

`use.trace: 'on-first-retry'` ve CI için bir retry ekle. `vite.config.ts` içindeki Vitest `test.exclude` ayarına `e2e/**` ekle (`configDefaults.exclude` varsayılanlarını koru); aksi halde `pnpm test`, Playwright spec dosyalarını Vitest olarak çalıştırır. İlk yerel denemeden önce `npx playwright install chromium` çalıştır.

## 2. Ana sayfa → arama → detay

`e2e/search.spec.ts` dosyasında `page.route` ile TMDB yanıtlarını sabitle. En azından açılışta gereken `/genre/movie/list` ve `/trending/movie/week`, aramada `/search/movie`, detayda `/movie/550` isteklerini karşıla. Liste yanıtı TMDB biçiminde `{ page, results, total_pages, total_results }` olsun. 550 başlığı **Dövüş Kulübü**; fixture olarak `curriculum/fixtures/tmdb/movie-550.json` biçimini örnek al. `Authorization: Bearer ...` yoksa 401 döndür. Eksik endpoint’e sessiz başarılı yanıt verme.

Tarayıcıda `/` aç; “Ara” bağlantısıyla aramaya git, “Film ara” **textbox**’ına `dövüş` yaz, sonuç bağlantısı görününce tıkla, detay başlığını doğrula. `page.waitForTimeout` kullanma.

## 3. Giriş → izleme listesi

`e2e/auth-watchlist.spec.ts` dosyasında `page.route` ile DummyJSON `POST /auth/login` yanıtını taklit et. Kullanıcı `emilys`, parola `emilyspass`; başarılı yanıt `id`, `username`, `accessToken`, `refreshToken` içermeli. Boş oturumla `/watchlists` aç: `/login`’e yönlenmeli, form görünmeli. Formu doldurup gönder; izleme listesi sayfasına dön, “Liste adı” alanına “Hafta sonu” yaz, “Kaydet”e bas, kayıtlı listede yeni adı doğrula. Bu spec için hazır `storageState` kullanma; router hatasını yakalamak istiyoruz.

Testleri proje dizininde `npx playwright test` ile çalıştır. Her spec kendi route’larını kurmalı; dış ağa bağımlı olmamalı.
