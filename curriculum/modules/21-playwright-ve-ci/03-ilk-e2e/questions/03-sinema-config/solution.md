## Neden böyle?

- **Tek adres, tek yer:** `SINEMA_URL` sabiti hem `use.baseURL`’i hem `webServer.url`’i besler. İkisi ayrışırsa Playwright bir porttaki sunucuyu bekler, testler başka porta gider; hata mesajı da kafa karıştırır.
- **`reuseExistingServer: !ci`:** Yerelde `pnpm dev` zaten açıksa ikinci bir sunucu başlatmaya çalışmak “port kullanımda” hatası verir; yeniden kullanmak hem hızlı hem zararsız. CI’da ise her koşu **temiz** başlamalı: önceki bir adımdan kalmış, eski kodla çalışan bir sunucuyu test etmek istemezsin.
- **`env` ile sahte token:** Modül 15’teki `env.ts` token yoksa açılışta hata fırlatır. CI’da `.env` yok ve olmamalı: sır, testin ihtiyacı değil. Vite, süreçte zaten tanımlı değişkeni `.env` ile ezmediği için bu değer yerelde de geçerli olur.
- **`devices['Desktop Chrome']`:** Pencere boyutu (1280×720), user agent ve tarayıcı türü tek pakette. Mobil görünümü test etmek istediğinde `devices['Pixel 7']` gibi bir proje eklemek yeter.

## Tuzaklar

- `url` yerine `port` da verilebilir, ama `url` daha kesin: Playwright o **adresin** cevap vermesini bekler (örneğin `/` sayfası derlenip gelene kadar).
- Cold start yavaşsa `webServer.timeout` (varsayılan 60 sn) artırılabilir.
- `command: 'vite'` de çalışır; ama `pnpm dev` projedeki script’i kullandığı için dev sunucusunun nasıl başladığı tek yerde (`package.json`) kalır.

## Sonraki adım

8. derste CI’a özgü ayarlar ekleyeceğiz: `forbidOnly`, `retries`, `trace: 'on-first-retry'` ve rapor ayarı. Proje görevinde bu ayarları Sinema’nın gerçek `playwright.config.ts` dosyasına yazacaksın.
