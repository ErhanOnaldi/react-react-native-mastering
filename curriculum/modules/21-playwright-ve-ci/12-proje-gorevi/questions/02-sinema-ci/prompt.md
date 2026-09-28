Sinema’nın kalite kontrolleri her push ve pull request’te temiz Ubuntu runner’da çalışmalı. Başarısız E2E koşusunun kaydı indirilebilir olmalı.

## Gereksinimler

- Workflow push ve pull_request olaylarında çalışır.
- Runner Ubuntu kullanır; checkout, pnpm 10 ve Node 24 hazırlanır.
- Bağımlılıklar repo kökünde frozen lockfile ile kurulur.
- Sinema çalışma dizininde lint, typecheck, Vitest, Chromium kurulumu ve Playwright E2E sırasıyla çalışır.
- E2E başarısız olduğunda test-results içeriği artifact olarak yüklenir.
- Gerçek TMDB token’ı workflow’da bulunmaz.

## Örnek

Push → install → lint → typecheck → Vitest → browser kurulumu → E2E. E2E kalırsa trace artifact’ı yüklenir.

## Sözleşme

- Proje: sinema.
- Dosya: projects/sinema/.github/workflows/sinema-ci.yml.
- Workflow, Sinema komutlarını projects/sinema çalışma dizininde yürütür; install repo kökünde çalışır.
- Tarayıcı: Chromium; E2E komutu Playwright testlerini başlatır.

## Kısıtlar

- Workflow temiz runner’da çalışmalı; geliştirici makinesindeki açık server veya browser’a dayanmamalı.
- Artifact yükleme önceki E2E adımı başarısız olsa da çalışmalı.
