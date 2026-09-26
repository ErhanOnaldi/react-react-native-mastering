# 📚 Kitaplık

Open Library üzerinde kitap arayıp okuma listeni tuttuğun, sade bir React uygulaması. Hesap gerekmez; listen bu tarayıcıda saklanır.

- Kitap adı ya da yazarla arama, sayfalama, paylaşılabilir linkler
- Eser detayı: açıklama, yazar, kapak
- Okuma listesi: durum (okumak istiyorum / okuyorum / okudum), puan, not

Gereksinimler: [`REQUIREMENTS.md`](./REQUIREMENTS.md) · Mimari kararlar: [`docs/adr/`](./docs/adr) · State haritası: [`docs/state-map.md`](./docs/state-map.md)

## Teknolojiler

React 19 · TypeScript 6 · Vite 8 · Tailwind CSS 4 · React Router 8 · TanStack Query 5 · React Hook Form 7 + Zod 4 · Vitest 5 + Testing Library + MSW 2 · Playwright · ESLint 10 + Prettier

## Kurulum

Node 24 ve pnpm 10 gerekir. API anahtarı yok, `.env` gerekmez.

```bash
pnpm install
pnpm dev            # http://localhost:5175
```

## Komutlar

| Komut                               | Ne yapar                                                             |
| ----------------------------------- | -------------------------------------------------------------------- |
| `pnpm dev`                          | Geliştirme sunucusu (HMR)                                            |
| `pnpm build`                        | Tip kontrolü (`tsc -b`) + üretim paketi (`dist/`)                    |
| `pnpm preview`                      | Üretim paketini yerelde sunar                                        |
| `pnpm typecheck`                    | Sadece tip kontrolü                                                  |
| `pnpm lint`                         | ESLint                                                               |
| `pnpm format` / `pnpm format:check` | Prettier ile biçimle / kontrol et                                    |
| `pnpm test`                         | Birim + entegrasyon testleri (Vitest, bir kez)                       |
| `pnpm test:watch`                   | Testleri izleme modunda çalıştır                                     |
| `pnpm test:e2e`                     | Playwright E2E (ilk seferde `pnpm exec playwright install chromium`) |

## Klasör yapısı

```
src/
  app/            route ağacı (createRoutes), provider'lar, layout, 404
  features/
    books/        Open Library istemcisi, şemalar, sorgular, arama ve detay sayfaları
    reading-list/ okuma listesi: şemalar, depolama, provider, form, liste sayfası
  shared/         feature'lardan bağımsız küçük UI parçaları ve yardımcılar
  test/           test kurulumu, MSW handler'ları, renderApp
e2e/              Playwright senaryoları (ağ page.route ile taklit edilir)
docs/             ADR'ler ve state haritası
```

## Testler

Strateji için bkz. [ADR 0003](./docs/adr/0003-test-stratejisi.md). Testler hiçbir zaman gerçek Open Library'ye gitmez: Vitest'te MSW, Playwright'ta `page.route` kullanılır.

## CI

`.github/workflows/ci.yml` her push ve pull request'te lint, biçim, tip kontrolü, testler ve build'i; ardından E2E'yi çalıştırır. E2E başarısız olursa Playwright raporu artifact olarak yüklenir.

Bu checkpoint bağımsız bir `pnpm-lock.yaml` içermez; CI ilk kurulumda `--no-frozen-lockfile` kullanır. Projeyi kendi reposuna taşıdığında oluşan lockfile'ı commit'leyip CI komutunu `--frozen-lockfile` olarak sıkılaştır.

## Veri kaynağı

Kitap verisi ve kapaklar [Open Library](https://openlibrary.org/developers/api)'den gelir. Open Library gönüllülerce işletilen ücretsiz bir servis: uygulama her tuşta değil form gönderilince arar ve yalnızca ihtiyaç duyduğu alanları ister.
