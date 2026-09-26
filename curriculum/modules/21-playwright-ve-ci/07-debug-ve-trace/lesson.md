---
title: "Kalan E2E testini izle: UI mode ve trace"
minutes: 8
kind: concept
---

# Test neden CI’da kaldı?

:::pain[Problem]
“Dövüş Kulübü” arama testi yerelde geçiyor, CI’da `toBeVisible` zaman aşımı veriyor. Hemen `waitForTimeout(5000)` eklersen test beş saniye yavaşlar, asıl sebep gizli kalır. CI ekran görüntüsünde yalnızca “Aranıyor…” yazıyor.
:::

## İlk bakış: UI mode

`npx playwright test --ui` komutu testi adım adım çalıştırıp locator’ları ve DOM’u inceletir. Başarısız adıma tıkla: hangi locator beklendi, sayfada o anda ne vardı? Burada `query` URL’ye yazılmamışsa sorun bekleme süresinde değil, uygulamadadır.

Yerelde geçip CI’da kalan test için `trace: 'on-first-retry'` ayarını config’e koy. İlk kalıştan sonraki denemede Playwright trace toplar. `npx playwright show-trace <dosya.zip>` ile aç; Actions, Network, Console ve DOM snapshot’larını birlikte incele.

```ts title="playwright.config.ts"
import { defineConfig } from '@playwright/test'

export default defineConfig({
  retries: process.env.CI ? 1 : 0,
  use: { trace: 'on-first-retry' },
})
```

## Hangi kanıt neyi söyler?

| İz | Olası neden |
| --- | --- |
| Network’te TMDB 401 | Token/header eksik veya route taklidi yanlış |
| Console’da render hatası | Bileşen çöktü; locator’ı değiştirmek çözmez |
| DOM’da eski sonuçlar | Yeni sorgunun tamamlanmasını beklemiyorsun |
| `/login` boş, yönlendirme tekrar ediyor | Korumalı route yanlış grupta |

`toMatchAriaSnapshot()` ile küçük bir bölgenin erişilebilir ağacını da karşılaştırabilirsin. Tüm sayfanın metnini dondurmak kırılgandır; ana menü veya form gibi kararlı parçayı seç. Modül 19’un a11y çalışması burada test sinyaline dönüşür.

## Saat kaynaklı test

Sinema’da “oturum süresi doldu” davranışı `Date`’e bağlıysa Node’daki `vi.useFakeTimers()` tarayıcı saatini değiştirmez. Playwright’ın `page.clock.install({ time: new Date(...) })` API’sini **gezinmeden önce** kur; sayfa açılırken oluşturulan timer’lar da denetim altında olur. Bu başka bir bağlamda önceki fake timer bilgisini tekrar kullanır.

:::mistake[Sık hata]
Trace üretimi için retry açtıysan CI artifact olarak `test-results/` klasörünü, özellikle başarısız koşulda yükle. Trace dosyasını repoya commit etme. `waitForTimeout` ancak bilinçli görsel gösterim için kullan; test senkronizasyonu için web-first assertion seç.
:::
