## Bağlam

E2E testi router hatasını artık yakalıyor. Onu çalıştırmayan bir push yine üretimi kırabilir. Repo kökünde `.github/workflows/sinema-ci.yml` oluştur. Checkpoint kopyası tek başına proje kökü gibi çalıştığı için aynı workflow dosyası checkpoint içinde `.github/workflows/sinema-ci.yml` yolunda bulunmalı.

## Gereksinimler

- `push` ve `pull_request` tetikleyicileri; Ubuntu runner.
- Checkout, pnpm ve Node kurulumu. Node 24 kullan; `setup-node` için pnpm cache açılabilir.
- Repo kökünde `pnpm install --frozen-lockfile`.
- `projects/sinema` çalışma dizininde sırasıyla `pnpm lint`, `pnpm typecheck`, `pnpm test`.
- E2E’den önce `npx playwright install --with-deps chromium`, sonra `npx playwright test`.
- Başarısız E2E’de `test-results/` trace artifact’ını `actions/upload-artifact` ile yükle (`if: failure()`).
- CI env’i `playwright.config.ts` içindeki `reuseExistingServer` davranışını temiz sunucuya çevirmeli. Gerçek TMDB token’ı workflow’a koyma; önceki görevdeki sahte `webServer.env` değeri yeterli.

## Kontrol

Push öncesi workflow YAML’ını ve çalışma dizinlerini oku. `pnpm test` Vitest’tir; Playwright için ayrıca `npx playwright test` gerekir. Her push’ta iki kritik akışın da koştuğundan emin ol.
