Temiz bir CI makinesinde E2E çalışmadan önce bağımlılıklar, hızlı kalite kontrolleri ve browser hazır olmalı. Komut listesini doğru sırada üret.

## Gereksinimler

- Kilit dosyasına bağlı kurulumla başla.
- Lint, typecheck ve Vitest kontrollerini E2E’den önce sırala.
- Chromium’u sistem bağımlılıklarıyla yükle.
- En son Playwright E2E komutunu çalıştır.
- Her adımı ayrı string olarak döndür.

## Örnek

Kurulum → lint → typecheck → Vitest → Chromium kurulumu → E2E.

## Sözleşme

- Dosya ve export: ciSteps.ts içinden ciSteps(): string[] fonksiyonunu export et.
- Beklenen komutlar: pnpm install --frozen-lockfile, pnpm lint, pnpm typecheck, pnpm test, npx playwright install --with-deps chromium ve npx playwright test.
