Sinema E2E senaryoları, yerelde ve CI’da aynı uygulama adresine bağlanmalı. Yerel ortamda açık sunucudan yararlanabilir; CI’da test için temiz sunucu başlatmalıdır.

## Gereksinimler

- Testler e2e klasöründen bulunmalı.
- Browser ve uygulama server’ı localhost:5174 adresini kullanmalı.
- Desktop Chromium profiliyle test çalışmalı.
- Testlerden önce geliştirme server’ı başlamalı ve hazır olana kadar beklenmeli.
- Yerelde hazır server kullanılabilir; CI her zaman temiz bir server başlatmalı.
- Server’a gerçek sır olmayan, boş olmayan bir TMDB test token’ı verilmeli.

## Örnek

Yerelde hazır server varsa kullanılabilir; CI’da Playwright kendi yeni server sürecini başlatır. Her iki durumda da browser ve server adresi aynı kalır.

## Sözleşme

- Dosya ve export: sinemaConfig.ts içindeki createSinemaConfig({ ci: boolean }) fonksiyonunu export et.
- Config dosyası verilen değerlerle uyumlu bir Playwright yapılandırması export eder.

### Config değerleri

- testDir: ./e2e.
- use.baseURL ve webServer.url: http://localhost:5174.
- projects: name chromium ve devices['Desktop Chrome'] kullanımı.
- webServer.command: pnpm dev.
- webServer.reuseExistingServer: !ci.
- webServer.env.VITE_TMDB_TOKEN: e2e-sahte-token gibi boş olmayan bir değer.
