---
title: "Sinema’yı her push’ta çalıştır: GitHub Actions"
minutes: 9
kind: concept
---

# Testler CI’da da yeşil mi?

:::pain[Problem]
Router hatasını E2E testin yakalıyor; ama yalnızca kendi bilgisayarında çalıştırınca. Giriş route’unu taşıyan commit, test komutu çalışmadan main’e girdi. Üstelik CI’daki temiz makinede Chromium yüklü değil.
:::

## Aynı komutlar, temiz makine

`.github/workflows/sinema-ci.yml` dosyası push ve pull request sırasında komutları çalıştırır. Sinema’nın package script’leri `lint`, `typecheck`, `test`; E2E için `npx playwright test` kullan. Bağımlılık kurulumu için `pnpm install --frozen-lockfile`, tarayıcı için **`npx playwright install --with-deps chromium`** gerekir. Yerelde ilk çalıştırmadan önce de bir kez `npx playwright install chromium` yap.

```yaml title=".github/workflows/sinema-ci.yml"
name: Sinema CI
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
        working-directory: projects/sinema
      - run: pnpm typecheck
        working-directory: projects/sinema
      - run: pnpm test
        working-directory: projects/sinema
      - run: npx playwright install --with-deps chromium
        working-directory: projects/sinema
      - run: npx playwright test
        working-directory: projects/sinema
        env:
          CI: 'true'
```

Sinema monorepo içinde çalışıyorsa `working-directory: projects/sinema` veya `pnpm --dir projects/sinema ...` kullan. Workflow adımının kökü ile Playwright config’in `webServer.command` çalışma dizini aynı uygulamayı göstermeli. Sahte `VITE_TMDB_TOKEN` config’in `webServer.env` alanından verilebilir; gerçek token’ı workflow’a yazma.

## Sıra neden önemli?

Önce lint ve typecheck hızlı hata verir. Vitest bileşen davranışını sınar. Sonra Chromium kurulur ve E2E gerçek tarayıcıda router ile UI’yi birleştirir. Aynı senaryoların farklı katmanlarda tekrarı, farklı türde hataları yakalar.

Playwright JSON raporu için `npx playwright test --reporter=json` kullanabilirsin. CI’da okunabilir terminal çıktısı istiyorsan varsayılan reporter’ı koru; JSON’u ayrı artifact olarak yükle. Başarısız E2E koşusunda `test-results/` trace artifact’ı indirip önceki dersteki Trace Viewer’da aç.

:::sector[Sektörde]
E2E sayısını kritik akışlarla sınırla: ana sayfa → arama → detay ve giriş → izleme listesi. Ayrıntılı kenar durumlarının çoğu Vitest/RTL katmanında daha hızlı ve kolay incelenir.
:::
