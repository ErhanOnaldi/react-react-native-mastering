Kitaplık'ın davranışları çalışıyor; şimdi bunların yarın da çalışacağını gösterecek test paketi ve CI hattı kur.

## Dosya ve davranış sözleşmesi

- `src/test/setup.ts`: `@testing-library/jest-dom/vitest`, RTL `cleanup`, MSW `server.listen({ onUnhandledRequest: 'error' })`, test sonrası `server.resetHandlers()`.
- `src/test/msw/handlers.ts`: `GET /search.json`, `GET /works/:id.json`, `GET /authors/:id.json` için deterministik Open Library cevapları. Olmayan eser 404 dönebilmeli. Gerçek ağa çıkma.
- `src/**/*.test.ts(x)`: en az **4 test dosyasında 12 test**. En az biri DOM olmadan saf mantığı (Zod şeması/depolama), en az üçü `screen` sorgularıyla kullanıcı çıktısını sınasın. En az bir test `user-event`, biri `server.use` ile hata yolunu denesin. Her testin adı Türkçe, gözlenen davranışı anlatsın.
- `e2e/*.spec.ts`: en az **2 Playwright senaryosu**. Bir duman testi ve arama → detay → okuma listesi gibi kritik akış. `page.route` ile `openlibrary.org` isteklerini taklit et; erişilebilir locator kullan.
- `.github/workflows/ci.yml`: `push` ve `pull_request` üzerinde çalışsın. Checkout, pnpm/Node kurulumu, `pnpm install`, `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `playwright install chromium`, `pnpm test:e2e` adımlarını içersin.
- `docs/adr/0003-test-stratejisi.md`: hangi K-n kabul kriterini hangi katmanda test ettiğini, nedenini ve açık riskleri yaz. Otomatik test bu belgenin kalitesini ölçmez; AI review rubric'i ölçer.

## Örnek test adları

- `it('kapak id’si -1 ise kırık görsel üretmez', …)`
- `it('Okudum seçilip puan verilmezse listeye eklemez', …)`
- `test('arama sonucu detaya açılır ve yenilemeden sonra okuma listesi kalır', …)`

Önce `pnpm test`, ardından `pnpm test:e2e` çalıştır. Son olarak workflow adımlarını kendi bilgisayarında sırayla uygula. CI'da E2E çalışabilmesi için tarayıcı kurulumu adımı, Playwright komutundan **önce** gelmeli.

:::tip
MSW handler'ında tüm aramalara aynı kitapları döndürürsen testler yanlış sorgu hatasını yakalayamaz. `q`, `page`, `limit` parametrelerini kullan; gerçek API'nin küçük, deterministik bir modelini kur.
:::
