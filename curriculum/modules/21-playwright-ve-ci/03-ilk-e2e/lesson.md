---
title: "İlk E2E testi: kurulum, config ve webServer"
minutes: 17
kind: concept
---

# İlk E2E testi: kurulum, config ve webServer

Önceki derste bir sayfada filmi nasıl bulup sonucunu nasıl bekleyeceğini gördün. Şimdi bu testin gerçekten Sinema uygulamasını açması gerekiyor. `page.goto('/')` derken tarayıcıya “hangi sunucunun kök sayfası?” diye bir adres vermediysen Playwright nereden başlayacağını bilemez.

Playwright’ın her teste verdiği hazır nesneye **fixture** denir. `page` fixture’ı, testin kullanacağı browser sekmesini verir; böylece test kendi sayfasında işlem yapar.

## Bir sayfayı aç ve görünür sonucu kontrol et

Playwright’ın `test` fonksiyonu bir test tanımlar; `expect` ise beklenen sonucu kontrol eder. Teste verilen `page`, açtığın tarayıcı sekmesidir:

```ts check title="e2e/home.spec.ts"
import { expect, test } from '@playwright/test'

test('giriş sayfası hesap bilgilerini ister', async ({ page }) => {
  await page.goto('http://localhost:5174/login')
  await expect(page.getByRole('heading', { name: 'Giriş yap' })).toBeVisible()
})
```

Burada adres tam yazılmış; test hangi sunucuya gideceğini bilir ve H1 başlığını bekler. Ama aynı adresi her testte yazarsan port değiştiğinde tüm dosyaları elden geçirmen gerekir. Bir de bu örnek yalnızca başlığı kanıtlar, film listesinin geldiğini değil.

### Tam adresten göreli yola

Config’te uygulamanın temel adresini bir kez tanımlayıp testte yalnızca yol kısmını kullanabilirsin. Bu temel adrese **baseURL** denir. Tam web adresinin `http://localhost:5174` kısmı **origin**’dir: protokol, host ve port birlikte hangi sunucuya bağlanacağını belirtir.

```ts check title="e2e/home.spec.ts"
import { expect, test } from '@playwright/test'

test('giriş formu etiketli alanlar gösterir', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Giriş yap' })).toBeVisible()
})
```

Yaptığımız tek değişiklik, tam adresi göreli `/login` yoluyla değiştirmek. Playwright bunu config’teki baseURL’ye ekler; bu yüzden bir test dosyasındaki origin değişince senaryoyu düzenlemen gerekmez. Başlık kontrolü aynı kullanıcı sonucunu doğrulamaya devam eder.

## Playwright sunucuyu ne zaman başlatır?

Test sırasında kullanılacak ayarlar `playwright.config.ts` dosyasında durur. Config, Playwright’a test dosyalarını nerede bulacağını, browser’da hangi adresi kullanacağını ve uygulama server’ını nasıl hazır edeceğini söyler.

`webServer`, testlerden önce çalıştırılacak server komutunu ve hazır olduğu anlaşılacak adresi tanımlar. Böylece yerelde ikinci bir terminal açıp `pnpm dev` başlatman gerekmez; Playwright server’ı başlatır ve URL cevap verene kadar bekler.

![Playwright sunucuyu hazır eder, ardından göreli adresi tarayıcıda açar](diagrams/test-baslangici.svg "Config’teki adresler aynı uygulamayı göstermelidir.")

```ts title="playwright.config.ts"
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:5174' },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5174',
  },
})
```

Buradaki `use.baseURL` ile `webServer.url` aynı origin’i işaret ediyor. İlk ayar göreli `page.goto('/')` yolunu çözer; ikincisi server’ın hazır olup olmadığını yoklar. Server `5173`’te, browser `5174`’te ararsa test açılmaz.

### Başlangıç sırasını izleyelim

| Sıra | Playwright ne yapar? | Beklenen kanıt | Sorun varsa bakılacak yer |
| --- | --- | --- | --- |
| 1 | Config’i okur | `testDir` ve `baseURL` ayarları bulunur | Config dosyası ve çalışma klasörü |
| 2 | `pnpm dev` komutunu başlatır | Uygulama süreci açılır | Komut ve ortam değişkenleri |
| 3 | `webServer.url` adresini yoklar | `localhost:5174` cevap verir | Port ve uygulama başlangıcı |
| 4 | Browser’da `page` açar | `/` baseURL ile birleşir | Origin’in doğru olması |
| 5 | Test adımlarını yürütür | Başlıklar ekranda görünür | Uygulama davranışı ve locator |

Bu sıra hata mesajını doğru yerde aramana yardım eder. `ERR_CONNECTION_REFUSED` alırsan browser adrese ulaşmış ama orada dinleyen server bulamamıştır; daha assertion’a gelinmemiştir. `Executable doesn't exist` görürsen Chromium dosyası eksiktir ve sayfa da açılmamıştır.

## Biraz daha gerçek config

Sinema’nın geliştirme server’ı `localhost:5174` adresinde çalışır. Testleri `e2e/` klasöründe tutup Desktop Chrome ayarlarıyla Chromium’da çalıştırmak için config’e proje ekleyebilirsin. **Project**, Playwright’ın bir grup test için kullandığı browser ve ayar kümesidir; burada tek grubumuz Chromium.

```ts title="playwright.config.ts"
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  use: { baseURL: 'http://localhost:5174' },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5174',
  },
})
```

`testDir` E2E dosyalarının klasörünü seçer; `projects` burada Desktop Chrome profilini kullanarak Chromium’u seçer. CI, yani **continuous integration**, kod değiştiğinde test ve build komutlarını otomatik çalıştıran sunucu ortamıdır. `reuseExistingServer` yerelde zaten açık olan server’ı kullanmaya izin verir; `createSinemaConfig({ ci })` gibi bir fonksiyonda verilen `ci` boolean’ını tersine çevirip `reuseExistingServer` değerine verirsin. Böylece CI’da her koşu kendi temiz server sürecini başlatır.

`webServer.env` değeri server sürecine ortam değişkeni olarak verilir. Vite’la kurulan Sinema, açılırken `VITE_TMDB_TOKEN` beklediği için testte gerçek API sırrı yerine `e2e-sahte-token` gibi boş olmayan sahte değer kullanabilirsin. Uygulamanın açılması için değer bulunmalı; E2E’nin gerçek TMDB hesabına erişmesi gerekmiyor.

## Server portu uyuşmadığında

Şöyle bir config düşün:

```ts
use: { baseURL: 'http://localhost:5174' },
webServer: { command: 'pnpm dev', url: 'http://localhost:5173' },
```

Playwright `5173`’ün hazır olduğunu görüp testi başlatır, ama `page.goto('/')` `5174`’e gider. Server’ın dinlediği port, hazır olma kontrolündeki adres ve baseURL aynı hedefe bakmalıdır.

Bir port zaten doluyken Vite başka bir port seçerse de test beklediğin uygulama yerine başka adrese gidebilir. `strictPort: true` Vite’a “seçtiğim port doluysa başka porta geçme, hata ver” der. Bu küçük ayar problemi başlangıçta gösterir; sessizce farklı adreste çalışan testi ayıklamak zorunda kalmazsın.

:::mistake[Bağlantı reddedildi]
**Belirti:** `page.goto` için `ERR_CONNECTION_REFUSED` görürsün. → **Neden:** Testin gittiği origin’de çalışan server yok ya da portlar eşleşmiyor. → **Düzeltme:** `webServer.command`, `webServer.url`, `baseURL` ve Vite portunu karşılaştır.
:::

## Playwright komutu ve Chromium

`@playwright/test` paketi test runner’ı ve browser’ı kullanacak API’yi sağlar; Chromium uygulamasının kendisi ayrıca indirilir. İlk kullanımda proje dizininde paketi ekleyip tarayıcıyı kurarsın:

```bash
pnpm add -D @playwright/test
pnpm exec playwright install chromium
```

E2E testi görünür masaüstü penceresi olmadan çalışabilir. Bu moda **headless** denir; CI’da masaüstü olmadığı için kullanışlıdır. Yerelde pencereli görmek istersen `pnpm exec playwright test --headed` çalıştırırsın. Genellikle package script’iyle `pnpm test:e2e` komutunu tanımlamak, uzun komutu hatırlama ihtiyacını azaltır.

Vitest de `.spec.ts` dosyalarını bulabildiğinden E2E klasörünü Vitest’in keşif kapsamından çıkarmalısın. Aksi halde `pnpm test` Playwright’a ait `test()` dosyasını Vitest gibi çalıştırmaya kalkar. İki runner’ı ayrı komutlarla çalıştırmak, hızlı UI testlerini ve tarayıcı yolculuklarını birbirine karıştırmaz.

:::info[Derinlemesine (isteğe bağlı)]
`.env` dosyaları geliştirme sırasında yerel ortam değişkenlerini verir; CI’da bu dosya olmayabilir. Playwright’ın `webServer.env` ayarı server’a test için gereken değeri verebilir. Vite’ta portu sabit tutmak için `server.port` ile `server.strictPort` ayarlarını kullanırsın. Test komutunu monorepo’da hangi package dizininden çalıştırdığın da config’in bulunmasını etkiler.
:::

## Özet

- Config, test klasörünü, browser profilini, baseURL’yi ve server başlangıcını belirler.
- `webServer` server’ı testlerden önce açar ve verdiğin URL cevap verince devam eder.
- `baseURL`, `webServer.url` ve Vite’ın portu aynı origin’e bakmalı.
- Playwright paketi ile Chromium kurulumu ayrıdır; CI’da headless browser kullanılır.

**Yeni terimler**

- **Fixture:** Playwright’ın teste sağladığı hazır nesne; `page` testin sekmesidir.
- **baseURL:** Testteki göreli yolların eklendiği temel web adresi.
- **Origin:** Protokol, host ve portun oluşturduğu web adresi kökü.
- **`webServer`:** Test başlamadan önce uygulama server’ını başlatıp hazır oluşunu bekleyen ayar.
- **Headless:** Browser’ın görünür pencere açmadan çalışması.

**Kendini yokla:** `page.goto('/search')` hangi tam adrese gider?  
*Cevap:* Config’teki baseURL’ye `/search` eklenen adrese.

**Kendini yokla:** `ERR_CONNECTION_REFUSED` hatasında önce locator’ı mı server adresini mi incelersin?  
*Cevap:* Server adresini ve sürecini; bu hata sayfaya erişmeden, `webServer` veya port aşamasında çıkar.
