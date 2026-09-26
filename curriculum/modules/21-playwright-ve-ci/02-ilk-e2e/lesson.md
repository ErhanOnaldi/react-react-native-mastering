---
title: "İlk E2E testi: kurulum, config ve webServer"
minutes: 10
kind: concept
---

# İlk E2E testi: kurulum, config ve webServer

:::pain[Problem]
1. derste gördüğün testi `e2e/home.spec.ts` dosyasına yazdın ve `pnpm exec playwright test` dedin:

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
```

Tarayıcı `/` adresinin **hangi sunucuda** olduğunu bilmiyor. Adresi `http://localhost:5174/` diye tam yazdın; bu sefer:

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5174/
```

Kimse `pnpm dev`’i başlatmamış. İkinci bir terminalde başlattın, test geçti. Peki CI’da o ikinci terminali kim açacak?
:::

## Kurulum: paket ve tarayıcı ayrı

```bash
cd projects/sinema
pnpm add -D @playwright/test          # test runner + tarayıcıyı süren kütüphane
pnpm exec playwright install chromium # tarayıcının kendisi (bir kez)
```

npm paketi yalnızca kodu getirir. Chromium, Firefox ve WebKit ayrı indirilir ve bilgisayarındaki bir önbellekte durur (macOS’ta `~/Library/Caches/ms-playwright`). Tarayıcı yoksa ilk koşu şöyle kalır: `Executable doesn't exist at …`.

:::info[Bu platformdaki görevler için]
Bu modülün kod görevleri de testlerini **gerçek Chromium’da** koşar. Repo kökünde bir kez `npx playwright install chromium` çalıştır; sonra hepsi hazır.
:::

## Bir testin anatomisi

```ts check title="e2e/home.spec.ts"
import { expect, test } from '@playwright/test'

test('ana sayfa trend filmleri gösterir', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Sinema' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Bu haftanın trend filmleri' })).toBeVisible()
})
```

- `test` ve `expect` **`@playwright/test`’ten** gelir, Vitest’ten değil. Bu ayrı bir test runner’ı.
- `{ page }` bir **fixture**: Playwright her teste yepyeni bir tarayıcı bağlamı (gizli pencere gibi) ve içinde bir sekme verir. `localStorage` ve çerezler testler arasında taşınmaz; testler birbirini bozamaz.
- Her satır `await` ister. Unutulan bir `await`, test bittikten sonra çalışmaya devam eden bir adım demektir.

## playwright.config.ts

Testlerin **nerede** ve **neye karşı** koşacağını config söyler:

```ts title="playwright.config.ts"
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5174',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
    env: { VITE_TMDB_TOKEN: 'e2e-sahte-token' },
  },
})
```

| Ayar | Ne işe yarar? |
| --- | --- |
| `testDir` | Test dosyalarının klasörü. `src/` içindeki Vitest testleriyle karışmasın diye ayrı: `e2e/`. |
| `use.baseURL` | `page.goto('/')` ve `toHaveURL('/login')` bu adrese göre çözülür. Adres **tek yerde** yazılır; staging’e geçmek tek satır. |
| `projects` | Hangi tarayıcılarda koşulacağı. `devices['Desktop Chrome']` hazır bir profil (pencere boyutu, user agent…). Firefox/WebKit’i sonra eklemek bir satır. |
| `webServer.command` | Testlerden **önce** çalıştırılacak komut. Playwright sunucuyu kendisi başlatır, testler bitince kapatır. |
| `webServer.url` | Playwright bu adres cevap verene kadar bekler; sonra ilk testi başlatır. |
| `reuseExistingServer` | `true` ise o adreste zaten çalışan bir sunucu varsa onu kullanır. Yerelde açık `pnpm dev`’ini kullanır; CI’da (`CI` değişkeni tanımlıyken) her zaman temiz bir sunucu başlatır. |
| `webServer.env` | Sunucu sürecine verilen ortam değişkenleri. |

Port 5174, Sinema’nın `vite.config.ts` dosyasındaki `server.port` değerinden geliyor; `baseURL` ile `webServer.url` aynı adresi göstermeli.

### Neden sahte token?

Modül 15’te `src/shared/config/env.ts` açılışta `VITE_TMDB_TOKEN`’ı Zod ile doğruluyor. CI makinesinde `.env` yok: token yoksa uygulama açılışta hata fırlatır ve beyaz ekran kalır. Üstelik E2E testinin gerçek sırrına ihtiyacı yok; 5. derste TMDB’yi tamamen taklit edeceğiz.

Vite, çalıştığı süreçte **zaten tanımlı** olan ortam değişkenlerini `.env` dosyalarıyla ezmez. Yani `webServer.env`’deki sahte token, yerelde repo kökündeki gerçek `.env`’den de öncelikli olur.

## Vitest ile Playwright’ı ayır

Vitest varsayılan olarak `**/*.{test,spec}.?(c|m)[jt]s?(x)` dosyalarını toplar. `e2e/home.spec.ts` de bu kalıba uyar: `pnpm test` onu Vitest ile çalıştırmaya kalkar ve Playwright’ın `test()`’i hata verir. Vitest’e o klasörü dışarıda bırakmasını söyle:

```ts title="vite.config.ts"
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  // …plugins, resolve, server
  test: {
    // …environment, setupFiles, env
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
})
```

## Çalıştırmak

```json title="package.json"
{
  "scripts": {
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

| Komut | Ne yapar? |
| --- | --- |
| `pnpm test:e2e` | Tüm E2E testleri, görünmez (headless) tarayıcıda |
| `pnpm test:e2e e2e/home.spec.ts` | Tek dosya |
| `pnpm test:e2e --headed` | Tarayıcıyı ekranda açarak |
| `pnpm test:e2e --ui` | UI mode: adım adım izleme (7. ders) |
| `pnpm exec playwright show-report` | Son koşunun HTML raporu |

:::mistake[Sık hata]
Adresi testlere gömmek: `page.goto('http://localhost:5174/search')`. Port değişince ya da testi staging’e karşı koşmak istediğinde her dosyayı değiştirirsin. Adres `baseURL`’de durur; testler göreli yol kullanır.
:::

:::sector[Sektörde]
Birçok takım CI’da testleri `vite preview` ile, yani **production build**’e karşı koşar: `command: 'pnpm build && pnpm preview --port 5174 --strictPort'`. Üretime en yakın koşul budur; bedeli her koşuda build süresidir. Yerelde dev sunucusu hızlı geri bildirim verir. Sinema’da `pnpm dev` ile başlıyoruz.
:::
