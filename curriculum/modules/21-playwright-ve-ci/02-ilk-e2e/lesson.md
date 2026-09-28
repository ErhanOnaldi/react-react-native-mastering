---
title: "İlk E2E testi: kurulum, config ve webServer"
minutes: 14
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

:::info[Tarayıcı kurulumu]
Playwright’ın Chromium kopyası bilgisayarda yoksa E2E başlamadan önce `npx playwright install chromium` komutunu çalıştır. Kurulum, proje bağımlılıklarını değiştirmez; testin kullanacağı tarayıcı dosyalarını indirir.
:::

## Bir testin anatomisi

```ts check title="e2e/program.spec.ts"
import { expect, test } from '@playwright/test'

test('program sayfası yaklaşan gösterimi sunar', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Etkinlikler' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Bu hafta' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Açık hava gösterimi' })).toBeVisible()
})
```

- `test` ve `expect` **`@playwright/test`’ten** gelir, Vitest’ten değil. Bu ayrı bir test runner’ı.
- `{ page }` bir **fixture**: Playwright her teste yepyeni bir tarayıcı bağlamı (gizli pencere gibi) ve içinde bir sekme verir. `localStorage` ve çerezler testler arasında taşınmaz; testler birbirini bozamaz.
- Her satır `await` ister. Unutulan bir `await`, test bittikten sonra çalışmaya devam eden bir adım demektir.

## Config, sunucu ve sekme aynı adresi paylaşır

:::model[Tarayıcı testinin başlangıç sırası]
Test runner önce config’i okur, sonra webServer’ı başlatır veya hazır olduğunu doğrular, en son browser context ve page açar. Göreli yol baseURL’ye eklenir. Bu adreslerden biri ayrışırsa uygulama açılmaz.

![Playwright sunucuyu hazır eder, ardından göreli adresi tarayıcıda açar](diagrams/test-baslangici.svg)
:::

Kesin kurallar:

1. baseURL tarayıcının köküdür; göreli yollar host ve portu test dosyalarından çıkarır.
2. webServer testten önce hazır olmalıdır. Playwright, url cevap verene kadar bekler.
3. baseURL ile webServer.url host ve port açısından eşleşmelidir.
4. Her testin page’i ayrı browser context içindedir; cookie ve localStorage başka teste taşınmaz.
5. Yerelde server’ı yeniden kullanmak hızlıdır; CI’da temiz süreç başlatmak eski uygulamaya bağlanmayı önler.

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

Adreslerden yalnızca birini değiştirmek yanlış yere bağlanmaya yol açar. Kırık örnek, tarayıcıyı 5174’e gönderirken server readiness kontrolünü başka portta bırakır:

```ts title="playwright.config.ts (kırık)"
use: { baseURL: 'http://localhost:5174' },
webServer: { command: 'pnpm dev', url: 'http://localhost:5173' },
```

Düzeltilmiş config’te iki alan aynı origin’i göstermelidir. Vite `server.port` değeri de bu tercihle eşleşir; server’ın seçtiği başka porta sessizce geçmek yerine uyuşmazlığı erken hata olarak görmek daha kolay teşhis edilir.

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

### Başlangıç hatasını adım adım ayıkla

Tam adresi bir test dosyasına yazmak sorunu çözmüş gibi görünür; fakat port değişince bütün dosyalar eski adrese bağlı kalır. baseURL ve webServer.url birlikte tek bir kaynak olursa staging’e geçmek ya da yerel portu değiştirmek daha kolaydır. Vite beklenen port doluyken başka bir port seçebiliyorsa testin adresi ile gerçek sunucu ayrışabilir; strictPort bu durumu sessizce ilerletmez.

| An | Playwright | Beklenen kanıt | Kanıt yoksa kontrol |
| --- | --- | --- | --- |
| 1 | Config okunur | testDir ve baseURL bulunur | Config yolu ve çalışma dizini |
| 2 | Komut başlar | webServer süreci çalışır | Komut, port ve env |
| 3 | URL kontrol edilir | HTTP cevabı gelir | Uygulama hatası veya port |
| 4 | Page açılır | Göreli route çözülür | baseURL eşleşmesi |
| 5 | Test yürür | UI assertion tamamlanır | Uygulama ve locator |

Tarayıcı paketi ile tarayıcının kendisini de ayır. @playwright/test komut ve API’yi getirir; Chromium executable’ı ayrıca indirilir. “Executable doesn’t exist” hatası testin sayfaya bağlanmasından önce çıkar, bu yüzden UI assertion’larını değiştirmek çözüm değildir. Temiz CI makinesinde browser kurulumu workflow’un bir adımı olmalıdır.

Yerelde E2E komutunu uygulama dizininden çalıştırmak, config ve package script’lerini aynı proje kökünde buluşturur. CI’da `working-directory` yanlışsa pnpm komutu doğru görünse bile farklı package.json okunabilir. Hata mesajında bulunamayan script’i değiştirmeden önce komutun hangi dizinde çalıştığını doğrula. Bir workflow’un birden çok paket kullandığı monorepo’da kök install ve uygulama komutlarının ayrı dizinlerde çalışması normaldir; yalnızca bu sınır açık olmalıdır.

Bir config’te `reuseExistingServer` yerelde açıkken eski bir dev server’ın yanlış build’i sunma riski vardır. Port zaten doluysa hangi uygulamanın o portu tuttuğunu kontrol et. CI’da runner temiz olsa da config bu davranışı açıkça kapatır; böylece test sonucu başka bir job’ın açık bıraktığı process’e bağlı olmaz.

Uygulamanın başlaması için gereken sahte env değeri test sürecine değil webServer sürecine verilir. Vite build’inde kullanılan env değerlerinin ne zaman bağlandığı 9. derste ele alınır; burada amaç test sunucusunun gerçek geliştirici sırrına ihtiyaç duymamasıdır.

Vitest ile Playwright aynı dosya uzantılarını yakalayabilir. E2E klasörü Vitest kapsamından çıkarılmalı; aksi halde pnpm test, Playwright fixture’ları olan spec’i jsdom içinde açmaya çalışır. İki runner farklı soruları yanıtlar: Vitest hızlı bileşen ve fonksiyon kontrollerini, Playwright tarayıcı yolculuklarını yürütür.

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
**Belirti:** Yerelde çalışan test staging’de başka portta kalır. → **Neden:** Tam origin her test dosyasına yazılmıştır. → **Düzeltme:** Origin’i baseURL’de tut ve senaryolarda göreli yol aç.
:::

:::sector[Sektörde]
Takımlar E2E’yi ya hızlı geliştirme sunucusunda ya da production build’i sunan preview’da çalıştırır. Dev sunucusu yerelde hızlı geri bildirim verir; preview dağıtılacak dosyaları sınar ve build süresini ekler. Her iki yaklaşımda da CI komutu, testin hangi uygulamaya bağlandığını açıkça belirlemelidir.
:::

## Özet

- Test runner önce server’ı hazır eder, sonra browser page açar.
- baseURL ve webServer.url aynı host ve portu göstermelidir.
- Playwright paketi ile Chromium binary’si ayrı kurulur.
- E2E dosyalarını Vitest keşif kapsamından çıkar.

**Kendini yokla:** page.goto('/search') hangi adresi temel alır?  
*Cevap:* Config içindeki baseURL’yi.

**Kendini yokla:** Executable hatasında önce locator’ı mı tarayıcı kurulumunu mu incelersin?  
*Cevap:* Tarayıcı kurulumunu; test henüz page açamamıştır.
