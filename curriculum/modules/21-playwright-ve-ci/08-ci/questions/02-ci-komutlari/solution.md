## Neden böyle?

`pnpm install --frozen-lockfile` temiz CI ortamında beklenmedik sürüm değişimini engeller. Lint ve typecheck hızlı geri bildirim verir; Vitest’ten sonra Playwright’ın Chromium binary’sini kurup gerçek tarayıcı akışını çalıştırırsın.

Alternatif olarak `pnpm exec playwright` kullanabilirsin; burada görev sözleşmesi `npx playwright` komutlarını istiyor. Komut dizisi tek başına workflow değildir: sonraki proje görevinde checkout, Node/pnpm kurulumu, tetikleyici ve çalışma dizinini de yazacaksın.
