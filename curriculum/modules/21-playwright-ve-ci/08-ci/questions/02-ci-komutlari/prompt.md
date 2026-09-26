## Bağlam

Sinema’nın router hatasını yakalayan E2E testi var. Şimdi temiz CI makinesinin komutlarını sırala; aksi halde tarayıcı binary’si bulunmaz veya yavaş E2E, basit bir tip hatasından önce koşar.

## Görev

`ciSteps(): string[]` fonksiyonu çalıştırılacak komutları sırayla döndürsün:

1. Kilit dosyasına sadık kurulum.
2. Lint, typecheck ve Vitest.
3. Chromium ile sistem bağımlılıklarını yükleme.
4. Playwright E2E testleri.

Her adımı ayrı string olarak döndür. Bu görevde yalnızca komut sırasını kuruyorsun; son dersin proje görevinde gerçek `.github/workflows/sinema-ci.yml` yazacaksın.
