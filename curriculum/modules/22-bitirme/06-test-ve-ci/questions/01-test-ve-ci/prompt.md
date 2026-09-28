Kitaplık uygulamasının tüm özelliklerini, sınır durumlarını ve yayına hazırlık şartlarını regresyonlara karşı koruyan çok katmanlı bir test paketi ve her push işleminde çalışan otomatik bir CI hattı kurman gerekiyor.

## Gereksinimler

Projenin test altyapısını ve sürekli entegrasyon hattını şu standartlara göre inşa et:

1. **Test Ortamı ve Ağ İzolasyonu:**
   - `src/test/setup.ts` dosyası: `@testing-library/jest-dom/vitest`, RTL `cleanup`, MSW `server.listen({ onUnhandledRequest: 'error' })` ve her testten sonra `server.resetHandlers()` çağrılarını içermelidir. Test sırasında gerçek ağa asla çıkılmamalıdır.
   - `src/test/msw/handlers.ts`: Open Library `/search.json`, `/works/:id.json` ve `/authors/:id.json` istekleri için deterministik cevaplar sunmalıdır. Olmayan eser için 404 dönebilmelidir.
2. **Birim ve Entegrasyon Test Paketi:**
   - En az **4 ayrı test dosyasında toplam 12 test** bulunmalıdır.
   - En az bir test DOM olmadan saf mantığı (örneğin Zod şema doğrulaması veya yerel depolama ayrıştırması) sınamalıdır.
   - En az üç test `screen` rol/metin sorgularıyla kullanıcıya görünen çıktıları doğrulamalıdır.
   - En az bir test kullanıcı etkileşimini (`user-event`), en az bir test ise `server.use` ile sunucu hata yolunu (500 veya 404) denemelidir.
   - Tüm test adları Türkçe ve gözlenebilir bir kullanıcı gereksinimini anlatan cümle olmalıdır.
3. **Uçtan Uca (E2E) Testler:**
   - `e2e/` dizini altında en az **2 Playwright senaryosu** bulunmalıdır: bir duman testi ve uçtan uca kritik akış (arama → detay → okuma listesine ekleme ve sayfayı yenileyince listenin korunması).
   - E2E testlerinde `page.route` kullanılarak Open Library ağ istekleri taklit edilmeli; erişilebilir locator'lar tercih edilmelidir.
4. **Sürekli Entegrasyon (CI) Hattı:**
   - `.github/workflows/ci.yml`: `push` ve `pull_request` tetikleyicilerinde çalışmalıdır.
   - İş akışı şu adımları sırayla yürütmelidir: Depoyu klonlama (checkout), pnpm ve Node kurulumu, bağımlılıkları yükleme (`pnpm install`), kod kalitesi denetimi (`pnpm lint`, `pnpm format:check`, `pnpm typecheck`), birim testleri (`pnpm test`), üretim derlemesi (`pnpm build`), Chromium kurulumu (`playwright install chromium`) ve E2E testleri (`pnpm test:e2e`).
5. **Test Stratejisi Belgesi:**
   - `docs/adr/0003-test-stratejisi.md`: Hangi kabul kriterinin (K-n) hangi test katmanında (Birim, Entegrasyon, E2E) güvenceye alındığını, nedenini ve kabul edilen açık riskleri belgelemelidir.

## Örnek

Gereksinimleri karşılayan test başlıkları:

```ts
it('kapak id’si -1 veya tanımsız olduğunda kırık görsel yerine yer tutucu gösterir', async () => { ... })
it('Okudum durumu seçilip puan verilmezse form hata verir ve listeye eklemez', async () => { ... })
test('kitap aranır, detaya gidilir ve okuma listesine eklenen kayıt yenilemeden sonra korunur', async ({ page }) => { ... })
```

## Sözleşme

- Test altyapısı dosyaları:
  - `src/test/setup.ts`
  - `src/test/msw/handlers.ts`
  - `playwright.config.ts`
  - `.github/workflows/ci.yml`
  - `docs/adr/0003-test-stratejisi.md`
- Test sayısı sözleşmesi:
  - En az 4 test dosyası, en az 12 Vitest testi.
  - En az 2 Playwright E2E senaryosu.
- Komut sözleşmesi:
  - `pnpm test`, `pnpm build` ve `pnpm test:e2e` komutları yerel ortamda ve CI hattında hatasız geçmelidir.

## Kısıtlar

- Testlerde `waitForTimeout` veya sabit yapay bekleme süreleri kullanılmamalıdır.
- Tanımsız ağ istekleri MSW tarafından hata (`onUnhandledRequest: 'error'`) sayılmalıdır.
